import { configure, close, createContext, DI } from './database'
import express from 'express';

test('Inject express middleware', async () => {
    const app = express();
    await configure(app, true);

    // The `app._router.stack` now contains several items
    // Most of them are express internals, but one of them is our middleware for the database
    // it is named '<anonymouse>'
    const middleware = app._router.stack.find((l: any) => l.name === '<anonymous>');
    expect(middleware).not.toBeNull();

    await close();
});

test('Valid database to be set up', async (done) => {
    const app = express();
    await configure(app, true);

    createContext(async () => {
        expect(await DI.userRepository.count()).toBe(1); // we should have 1 user
        expect(await DI.paymentRepository.count()).toBe(1); // we should have one payment
        expect(await DI.productRepository.count()).toBeGreaterThan(0); // we should have some products

        await close();
        done()
    });

});

