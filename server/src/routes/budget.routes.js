const express = require('express');
const router = express.Router();
const { create, getAll, getStatus, update, remove } = require('../controllers/budget.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { create: createSchema, update: updateSchema } = require('../validators/budget.validator');

router.use(auth);

router.get('/', getAll);
router.get('/status', getStatus);
router.post('/', validate(createSchema), create);
router.put('/:id', validate(updateSchema), update);
router.delete('/:id', remove);

module.exports = router;
