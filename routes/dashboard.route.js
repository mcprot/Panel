let express = require('express');
let router = express.Router();
let News = require('../models/news.model');
let Connections = require('../models/connection.model');

router.get('/', function (req, res, next) {
    let bandwidth_bytes_egress = 0;
    let bandwidth_bytes_ingress = 0;

    let connectionCount = 0;

    let now = new Date();
    let startDateMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    let endDateMonth = new Date(now.getFullYear(), now.getMonth() + 2, 1);
    Connections.find({
        date_disconnect: {
            $gt: startDateMonth,
            $lt: endDateMonth
        }
    }, (err, result) => {
        connectionCount = result.length;
        result.forEach((con) => {
           bandwidth_bytes_egress+=con.bytes_egress;
           bandwidth_bytes_ingress+=con.bytes_ingress;
        });
    });

    News.find({}, (err, news) => {
        let gig_egress = (bandwidth_bytes_egress * (Math.pow(10, -9)));
        let gig_ingress = (bandwidth_bytes_ingress * (Math.pow(10, -9)));

        let text_egress = gig_egress > 1000 ? (gig_egress/1000).toFixed(2) + "TB"
            : gig_egress.toFixed(2) + "GB";
        let text_ingress = gig_ingress > 1000 ? (gig_ingress/1000).toFixed(2) + "TB"
            : gig_ingress.toFixed(2) + "GB";

        return res.render("dashboard", {
            title: "Dashboard",
            news: news,
            ingress: text_ingress,
            egress: text_egress,
            connection_count: connectionCount
        });
    }).sort({date: 1}).limit(5);
});

module.exports = router;