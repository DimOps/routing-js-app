import { getItemDetails } from "../api/data.js";
import { html, until } from "../bundler.js";
import { getUserData } from "../utils.js";

const detailsTemplate = (itemPromise) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Furniture Details</h1>
    </div>
</div>
<div class="row space-top">
    ${until(itemPromise, html`<p>Loading &hellip;</p>`)}
</div> `;

const itemTemplate = (item, isOwner) => html`
<div class="col-md-4">
    <div class="card text-white bg-primary">
        <div class="card-body">
            <img src=${item.img} />
        </div>
    </div>
</div>
<div class="col-md-4">
    <p>Make: <span>${item.make}</span></p>
    <p>Model: <span>${item.model}</span></p>
    <p>Year: <span>${item.year}</span></p>
    <p>Description: <span>${item.description}</span></p>
    <p>Price: <span>${item.price}</span></p>
    <p>Material: <span>${item.material}</span></p>
    ${ isOwner ? html`<div>
        <a href=${`/edit/${item._id}`} class="btn btn-info">Edit</a>
        <a href="javascript:void(0)" class="btn btn-red">Delete</a>
    </div>` : null}

</div>`;

export function detailsPage(ctx){
    ctx.render(detailsTemplate(loadItem(ctx.params.id)));
    
}

async function loadItem(id) {
    const item = await getItemDetails(id);
    const user = getUserData();
    let isOwner = false
    if (user.id == item._ownerId){
        isOwner = true;
    }
    
    return itemTemplate(item, isOwner);
}