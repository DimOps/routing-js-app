import { register } from "../api/api.js";
import { html } from "../bundler.js";

const registerTemplate = (onSubmit, errorMessage, errors) => html`
<div class="row space-top">
    <div class="col-md-12">
        <h1>Register New User</h1>
        <p>Please fill all fields.</p>
    </div>
</div>
<form @submit=${onSubmit}>
    <div class="row space-top">
        <div class="col-md-4">
            ${errorMessage ? html`<div class="form-group error">${errorMessage}</div>` : null}
            <div class="form-group">
                <label class="form-control-label" for="email">Email</label>
                <input class=${'form-control' + (errors.email ? ' is-invalid' : '')} id="email" type="text" name="email">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="password">Password</label>
                <input class=${'form-control' + (errors.password ? ' is-invalid' : '')} id="password" type="password" name="password">
            </div>
            <div class="form-group">
                <label class="form-control-label" for="rePass">Repeat</label>
                <input class=${'form-control' + (errors.rePass ? ' is-invalid' : '')} id="rePass" type="password" name="rePass">
            </div>
            <input type="submit" class="btn btn-primary" value="Register" />
        </div>
    </div>
</form>`;

export function registerPage(ctx){
    update(null, {});
    
    function update(errorMessage, errors) {
        ctx.render(registerTemplate(onSubmit, errorMessage, errors));
    }

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        const email = formData.get('email').trim(); 
        const password = formData.get('password').trim();
        const rePass = formData.get('rePass').trim();
        

        try{
            if (email == '' || password == '') {
                throw {
                    error: new Error('All fields are required!'),
                    errors: {
                        email: email == '',
                        password: password == '',
                        rePass: rePass == ''
                    }
                };
            }
            if (password != rePass) {
                throw {
                    error: new Error('Passwords don\'t match!'),
                    errors: {
                        password: true,
                        rePass: true
                    }
                };
            }
    
            await register(email, password);
            ctx.updateNav();
            e.target.reset();
            ctx.page.redirect('/');
        } catch (err) {
            const message = err.message || err.error.message;  // if no thrown error, check the object
            update(message, err.errors || {});  // if the request has thrown, empty object will compare to false
        }
    }
}