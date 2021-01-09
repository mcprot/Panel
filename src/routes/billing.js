import {Router} from 'express';
import {apiService} from '../services';

let router = Router();


router.get('/plans',
    async (req, res, next) => {
        const plans = await apiService.getPlans();
        if (plans) return res.render("plans", {
            title: "Billing | Plans",
            plans: plans.splice(0, 4),
        });
        return next();
    });

router.get('/invoices',
    async (req, res, next) => {
        const plans = await apiService.getPlans();
        if (plans) return res.render("invoices", {
            title: "Billing | Plans",
            plans: plans.splice(0, 4),
        });
        return next();
    });

export default router;
