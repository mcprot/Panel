import {Router} from 'express';
import {apiService} from '../services';
let router = Router();


router.get('/plans',
    async (req, res, next) => {
        const plans = await apiService.getPlans();
        if(plans) return res.render("billing_plans", {
            title: "Billing | Plans",
            plans: plans.splice(0, 4),
        });
        return next();
});

export default router;
