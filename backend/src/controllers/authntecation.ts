import express from 'express';
import { getUserByEmail, createUser } from '../db/users';
import { random, authentication } from '../helpers';

export const login = async (
  req: express.Request,
  res: express.Response
): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');

    if (!user || !user.authentication) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password !== expectedHash) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    const salt = random();
    user.authentication.sessionToken = authentication(salt, user.id.toString());

    await user.save();

    res.cookie('MODAR-AUTH', user.authentication.sessionToken, {
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000 // 24 hours
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const register = async (req: express.Request, res: express.Response): Promise<any> => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const hashedPassword = authentication(salt, password); // استخدام الدالة authentication لتجزئة كلمة المرور
    const user = await createUser({        // استخدام الدالة createUser لإنشاء مستخدم جديد
      email,
      username,
      authentication: {
        salt,
        password: hashedPassword,
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
