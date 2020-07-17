let express = require('express');
let Server = require('../models/server.model');
let router = express.Router();

router.get('/analytics', function (req, res, next) {
    if(!req.user.admin){
        res.redirect("/");
    }

    return res.render("admin/analytics", {title: 'Admin | Analytics'});
});

router.get('/servers', function (req, res, next) {
    if(!req.user.admin){
        res.redirect("/");
    }

    Server.find({}, function (err, servers) {
        return res.render("admin/servers", {
            title: "Admin | Servers",
            servers: servers,
        });
    }).sort({last_request: -1});
});

router.get('/servers/add', function (req, res, next) {
    if(!req.user.admin){
        res.redirect("/");
    }

    return res.render("admin/servers_add", {title: 'Admin | Servers | Add'});
});

router.get('/servers/delete/:server', (req, res, next) => {
    if(!req.user.admin){
        res.redirect("/");
    }
    Server.exists({_id: req.params.server}, (err, result) => {
        if(result){
            Server.deleteOne({_id: req.params.server}, (err) => {
                if(err){
                    req.session.error = "An error has occurred.";
                    res.redirect('back');
                }
                req.session.info = "Successfully deleted.";
                res.redirect('back');
            });
        }
    });
});

router.post('/servers/add', (req, res, next) => {
    if(!req.user.admin){
        return res.redirect("/");
    }

    let ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if(req.body.ip_address.match(ipFormat) &&
        req.body.api_key != "API Key" && req.body.api_key &&
        req.body.location &&
        req.body.ip_address) {

        let server_data = {
            ip_address: req.body.ip_address,
            api_key: req.body.api_key,
            location: req.body.location,
            last_request: Date.now(),
        };
        Server.create(server_data, function (error) {
            if (error) {
                req.session.error = "Unable to add server.";

                res.redirect("/admin/servers/add");
            }else{
                req.session.info = "Successfully added server.";

                res.redirect("/admin/servers");
            }
        });
    }else{
        res.render("admin/servers_add", {title: "Admin | Servers | Add", error: "Unable to add server. Try again!"});
    }
});


module.exports = router;