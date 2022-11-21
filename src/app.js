import { logout } from './api/api.js';
import { page, render } from './bundler.js'
import { catalogPage } from './views/catalog.js';
import { createPage } from './views/create.js';
import { detailsPage } from './views/details.js';
import { editPage } from './views/edit.js';
import { loginPage } from './views/login.js';
import { registerPage } from './views/register.js';


const root = document.querySelector('div.container');
document.getElementById('logoutBtn').addEventListener('click', onLogout);


page(decorateContext);  // executes before accessing a link => dependency injection
page('/', catalogPage);
page('/details/:id', detailsPage);
page('/create', createPage);
page('/edit', editPage);
page('/login', loginPage);
page('/register', registerPage);
page('/my-furniture', catalogPage);

page.start();


function decorateContext (ctx, next) {
    ctx.render = (content) => render(content, root);

    next();
}


async function onLogout() {
    await logout();
    page.redirect('/');
}