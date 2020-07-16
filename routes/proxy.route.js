let express = require('express');
let router = express.Router();
let Proxy = require("../models/proxy.model");
let Analytic = require("../models/analytic.model");
let Plan = require("../models/plan.model");
let Invoice = require("../models/invoice.model");

router.get('/new/:plan', function (req, res, next) {
    Plan.exists({ _id: req.params.plan}, function(err, result) {
        if(result){
            res.render("proxy_new", {title: "Proxy | New", plan: req.params.plan});
        }else{
            res.redirect("/billing/plans");
        }
    });
});

router.get('/manage', function (req, res, next) {
    Proxy.find({user: req.user._id}, (err, proxies) => {
        Plan.find({}, (err, plans) => {
            res.render("proxy_manage", {title: "Proxy | Manage", proxies: proxies, plans: plans});
        });
    });
});

router.get('/delete/:proxy', (req, res) => {
    Proxy.exists({_id: req.params.proxy, user: req.user._id}, (err, result) => {
        if(result){
            Proxy.deleteOne({_id: req.params.proxy}, (err) => {
                if(err){
                    req.session.error = "An error has occurred.";
                    res.redirect('back');
                }
                Analytic.deleteOne({proxy_id: req.params.proxy}, (err) => {
                    if(err){
                        req.session.error = "An error has occurred.";
                        res.redirect('back');
                    }

                    req.session.info = "Successfully deleted.";
                    res.redirect('back');
                });
            });
        }
    });
});

router.post('/new/:plan', (req, res) => {
    Plan.exists({ _id: req.params.plan}, function(err, result) {
        let proxy_data = {
            hostname: req.body.hostname,
            targets: req.body.targets.replace(" ", "").split(',')
        }
        Plan.findOne({_id: req.params.plan}, (err, plan) => {
            if(proxy_data.targets.length <= plan.targets){
                // TODO if plan is free, make proxy, if it's not, then make invoice, etc.
                if(plan.price > 0){
                    //TODO create invoice
                }else{
                    Proxy.exists({hostname: proxy_data.hostname}, (err, result) => {
                        if(!result) {
                            Proxy.create({
                                user: req.user._id,
                                targets: proxy_data.targets,
                                hostname: proxy_data.hostname,
                                expiry: new Date(2100, 1, 1),
                                plan: plan._id
                            }).then(proxy => {
                                Analytic.create({
                                    proxy_id: proxy._id,
                                    bandwidth: 0.00
                                }).then(analytic => {
                                    req.session.info = "Successfully created a new proxy.";
                                    res.redirect('/proxy/manage');
                                }).catch(err => {
                                    req.session.error = "An error has occurred.";
                                    res.redirect('back');
                                });
                            }).catch(err => {
                                req.session.error = "An error has occurred.";
                                res.redirect('back');
                            });
                        }else{
                            req.session.error = "Hostname already exists.";
                            res.redirect('back');
                        }
                    });
                }
            }else{
                req.session.error = "This plan does not allow more than " + plan.targets + " targets.";
                res.redirect("back");
            }
        });
    });
});

router.get('/new', function (req, res, next) {
    res.redirect("/billing/plans");
});

module.exports = router;