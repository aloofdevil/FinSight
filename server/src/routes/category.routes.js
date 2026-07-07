const express = require('express');
const router = express.Router();
const { getAll, create, update, remove } = require('../controllers/category.controller');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const { create: createSchema, update: updateSchema } = require('../validators/category.validator');

router.use(auth);

router.get('/', getAll);
router.post('/', validate(createSchema), create);
router.put('/:id', validate(updateSchema), update);
router.delete('/:id', remove);

module.exports = router;
