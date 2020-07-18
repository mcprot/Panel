let express = require('express');
let router = express.Router();

let Proxy = require("../models/proxy.model");
let Analytic = require("../models/analytic.model");
let Plan = require("../models/plan.model");
let Invoice = require("../models/invoice.model");
let Connections = require("../models/connection.model");
let MinecraftVersions = require("../data/MinecraftVersions");

router.get('/new/:plan', function (req, res, next) {
    Plan.exists({_id: req.params.plan}, function (err, result) {
        if (result) {
            res.render("proxy_new", {title: "Proxy | New", plan: req.params.plan});
        } else {
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

router.get('/analytics/:proxy', function (req, res, next) {
    let now = new Date();
    let startDateMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    let endDateMonth = new Date(now.getFullYear(), now.getMonth() + 2, 1);
    let daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    Connections.find({
        proxy_id: req.params.proxy,
        date_disconnect: {
            $gt: startDateMonth,
            $lt: endDateMonth
        }
    }, (err, result) => {
        let versions_month = [];
        let connections_month = []
        if (result) {
            result.forEach(con => {

                //versions pie
                function getRandomColor() {
                    let letters = '0123456789ABCDEF';
                    let color = '#';
                    for (let i = 0; i < 6; i++) {
                        color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                }

                let proto = MinecraftVersions.protocolVersions.find(versions => con.version == versions.version);
                let ver = versions_month.find(ver => proto.minecraftVersion == ver.label);
                if (ver) {
                    ver.value += 1
                } else {
                    let random_color = getRandomColor();
                    versions_month.push({
                        value: 1, color: random_color,
                        highlight: random_color, label: proto.minecraftVersion
                    });
                }
            });
        }

        return res.render("proxy_analytics", {title: "Proxy | Analytics", versions: JSON.stringify(versions_month)});
    });
});

router.get('/delete/:proxy', (req, res) => {
    Proxy.exists({_id: req.params.proxy, user: req.user._id}, (err, result) => {
        if (result) {
            Proxy.deleteOne({_id: req.params.proxy}, (err) => {
                if (err) {
                    req.session.error = "An error has occurred.";
                    res.redirect('back');
                }
                Analytic.deleteOne({proxy_id: req.params.proxy}, (err) => {
                    if (err) {
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
    Plan.exists({_id: req.params.plan}, function (err, result) {
        let proxy_data = {
            hostname: req.body.hostname,
            targets: req.body.targets.replace(" ", "").split(',')
        }
        Plan.findOne({_id: req.params.plan}, (err, plan) => {
            if (proxy_data.targets.length <= plan.targets) {
                // TODO if plan is free, make proxy, if it's not, then make invoice, etc.
                if (plan.price > 0) {
                    //TODO create invoice
                } else {
                    Proxy.exists({hostname: proxy_data.hostname}, (err, result) => {
                        if (!result) {
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
                        } else {
                            req.session.error = "Hostn ame already exists.";
                            res.redirect('back');
                        }
                    });
                }
            } else {
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