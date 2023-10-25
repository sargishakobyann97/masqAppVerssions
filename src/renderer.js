window.addEventListener("DOMContentLoaded", async () => {
    window.api.panel.events("first_run", (m) => console.log(m));
    window.api.panel.events("get_add_app", (m) => console.log(m));
    // const pr = await api.profile.save({
    //     name: "my an profile 10",
    //     os: "macOS"
    // });

    // const pr = await profile.get("254c3170-1139-4cfd-9e77-98942383cc4e")
    // const pr = await api.profile.get_all()
    //"ddc293bd-faec-4cbf-8884-8c575576b0bc"
    //"eaa7965d-8cb4-47d0-a196-716f8df94588"
    //"ba37447b-54f2-4920-a20d-dc5af84096e3"
    //"6d49cb64-db09-4782-8346-8dc9b032f424"

    // await api.profile.delete("47f3eb2b-c8f6-4d1b-97ce-b350d1dc976a")
    // await api.profile.delete_all()

    // console.log(pr)

    // await api.profile.update("84fc970a-ce74-4833-87cb-5b00a9ff60c4", {name: "New name 6", OS: "macOS"})
    // await api.profile.update("c96d4ec8-eb60-4122-88a6-d758a6403f5b", {name: "New name 7", OS: "macOS"})
});
