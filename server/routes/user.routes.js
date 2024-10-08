import express from 'express'; 
import { deleteUser, getUser, getUsers, signOut, updateUser } from '../controllers/user.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/test', (req, res) => {
    res.send('From test');
});

router.put("/update/:userId", verifyUser, updateUser);
router.delete("/delete/:userId", verifyUser, deleteUser);
router.post('/signout', signOut);
router.get('/getusers', verifyUser, getUsers);
router.get('/:userId', getUser);

export default router;