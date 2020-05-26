export default async(ctx) => {
    // use this file to load endpoints at app startup
    await Promise.all([
        ctx.store.dispatch("getMMData", {
            resource: ""
        }),
        ctx.store.dispatch("getMMData", {
            resource: "banners"
        }),
        ctx.store.dispatch("getMMData", {
            resource: "hours"
        }),
        ctx.store.dispatch("getMMData", {
            resource: "stores"
        }),
        ctx.store.dispatch("getMMData", {
            resource: "promotions"
        }),
        ctx.store.dispatch("getMMData", {
            resource: "jobs"
        }),
        ctx.store.dispatch("getMMData", {
            resource: "events"
        }),
        ctx.store.dispatch("getMMData", {
            resource: "categories"
        }),
        ctx.store.dispatch("getMMData", {
            resource: "galleries"
        }),
        ctx.store.dispatch("loadAuthInfo"),

    ]);
}