import { getItemDetails, editItem } from "../api/data.js";
import { html, until } from "../bundler.js";

const editTemplate = (itemPromise) => html`
 <div class="row space-top">
    <div class="col-md-12">
        <h1>Edit Furniture</h1>
        <p>Please fill all fields.</p>
    </div>
    ${until(itemPromise, html`<p>Loading &hellip;</p>`)}
</div>`;

const formTemplate = (item, onSubmit, errorMessage, errors) => html` 
<form @submit=${onSubmit}>
    ${errorMessage ? html`<div class="form-group error">${errorMessage}</div>` : null}
    <div class="row space-top">
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-make">Make</label>
                <input class=${'form-control' + (errors.make ? ' is-invalid' : '')} id="new-make" type="text" name="make" .value=${item.make}>
            </div>
            <div class="form-group has-success">
                <label class="form-control-label" for="new-model">Model</label>
                <input class=${'form-control' + (errors.model ? ' is-invalid' : '')} id="new-model" type="text" name="model" .value=${item.model}>
            </div>
            <div class="form-group has-danger">
                <label class="form-control-label" for="new-year">Year</label>
                <input class=${'form-control' + (errors.year ? ' is-invalid' : '')} id="new-year" type="number" name="year" .value=${item.year}>
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-description">Description</label>
                <input class=${'form-control' + (errors.description ? ' is-invalid' : '')} id="new-description" type="text" name="description" .value=${item.description}>
            </div>
        </div>
        <div class="col-md-4">
            <div class="form-group">
                <label class="form-control-label" for="new-price">Price</label>
                <input class=${'form-control' + (errors.price ? ' is-invalid' : '')} id="new-price" type="number" name="price" .value=${item.price}>
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-image">Image</label>
                <input class=${'form-control' + (errors.img ? ' is-invalid' : '')} id="new-image" type="text" name="img" .value=${item.img}>
            </div>
            <div class="form-group">
                <label class="form-control-label" for="new-material">Material (optional)</label>
                <input class="form-control" id="new-material" type="text" name="material" .value=${item.material}>
            </div>
            <input type="submit" class="btn btn-info" value="Edit" />
        </div>
    </div>
</form>`;

export function editPage(ctx) {
    const itemPromise = getItemDetails(ctx.params.id);
    update(itemPromise, null, {});

    function update(itemPromise, errorMessage, errors) {
        ctx.render(editTemplate(loadItem(itemPromise, errorMessage, errors)));
    }

    async function loadItem(itemPromise, errorMessage, errors) {
        const item = await itemPromise;
    
        return formTemplate(item, onSubmit, errorMessage, errors);
    }

    async function onSubmit(e) {
        e.preventDefault();
        const formData = [...(new FormData(e.target)).entries()];
        const dataObject = formData.reduce((a, [k, v]) => Object.assign(a, {[k]: v}), {});
        
        const emptyFields = formData.filter(([k, v]) => k != 'material' && v == '');

        try{
            if (emptyFields.length > 0) {
                const errors = emptyFields.reduce((a, [k]) => Object.assign(a, { [k] : true }), {})
                throw {
                    error: new Error('Please fill all the mandatory forms!'),
                    errors
                };
            }

            dataObject.year = Number(dataObject.year);
            dataObject.price = Number(dataObject.price);

            const item = await editItem(ctx.params.id, dataObject);
            e.target.reset();
            ctx.page.redirect('/details/' + item._id);
        } catch (err) {
            const message = err.message || err.error.message;
            update(dataObject, message, err.errors || {});
        }
    }
}

