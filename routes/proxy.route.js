let express = require('express');
let router = express.Router();

let Proxy = require("../models/proxy.model");
let Analytic = require("../models/analytic.model");
let Plan = require("../models/plan.model");
let Invoice = require("../models/invoice.model");
let Connections = require("../models/connection.model");

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
    let startDateMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    let endDateMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    let daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    let bandwidth_bytes_egress = 0;
    let bandwidth_bytes_ingress = 0;

    let connectionCount = 0;

    Connections.find({
        proxy_id: req.params.proxy,
        date_disconnect: {
            $gt: startDateMonth,
            $lt: endDateMonth
        }
    }, (err, result) => {
        let versions_month = [];
        let successful_connections_month = [];
        let failed_connections_month = []
        let connections_month_labels = [];
        if (result) {

            connectionCount = result.length;

            result.forEach(con => {
                bandwidth_bytes_egress += con.bytes_egress;
                bandwidth_bytes_ingress += con.bytes_ingress;
            })

            for (let dayInc = 1; dayInc <= daysInMonth; dayInc++) {
                connections_month_labels.push((new Date().toDateString().substring(4, 7)) + " " + dayInc);

                let successfulConnections = 0;
                let failedConnections = 0;
                result.forEach(con => {
                    let conDate = con.date_disconnect;
                    //console.log(conDay + " - " + dayDate);
                    if (conDate.getDate() == dayInc) {
                        if(con.success){
                            successfulConnections+=1;
                        }else{
                            failedConnections+=1;
                        }
                    }
                });

                successful_connections_month.push(successfulConnections);
                failed_connections_month.push(failedConnections);
            }
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

                let MinecraftData = require("minecraft-data")(con.version);
                let proto = null;
                try {
                    proto = MinecraftData.version
                } catch (ex) {
                    proto = {minecraftVersion: "Unknown"};
                }

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

        let gig_egress = (bandwidth_bytes_egress * (Math.pow(10, -9)));
        let gig_ingress = (bandwidth_bytes_ingress * (Math.pow(10, -9)));

        let text_egress = gig_egress > 1000 ? (gig_egress / 1000).toFixed(2) + "TB"
            : gig_egress.toFixed(2) + "GB";
        let text_ingress = gig_ingress > 1000 ? (gig_ingress / 1000).toFixed(2) + "TB"
            : gig_ingress.toFixed(2) + "GB";

        return res.render("proxy_analytics", {
            title: "Proxy | Analytics",
            versions: JSON.stringify(versions_month),
            failed_connections_month: JSON.stringify(failed_connections_month),
            successful_connections_month: JSON.stringify(successful_connections_month),
            connections_month_labels: JSON.stringify(connections_month_labels),
            ingress: text_ingress,
            egress: text_egress,
            connection_count: connectionCount
        });
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