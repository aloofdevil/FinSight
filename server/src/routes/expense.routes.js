const express = require('express');
const router = express.Router();
const { create, getAll, getById, update, remove } = require('../controllers/expense.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { create: createSchema, update: updateSchema, query: querySchema } = require('../validators/expense.validator');

router.use(auth);

router.get('/', validate(querySchema, 'query'), getAll);
router.get('/:id', getById);
router.post('/', validate(createSchema), create);
router.put('/:id', validate(updateSchema), update);
router.delete('/:id', remove);

module.exports = router;
