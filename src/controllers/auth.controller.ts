import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, UserToLogin } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

interface AuthenticatedRequest extends Request {
  user?: UserToLogin;
}

// Middleware de verificação de autenticação
export async function isAuthenticated(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // const secretKey = process.env.JWT_SECRET || 'default_secret'

  const secretKey = process.env.JWT_SECRET;

// Verificar se a chave secreta está definida
  if (!secretKey) {
    throw new Error('Secret key not found in .env file');
  }

  try {
    const decoded = jwt.verify(token, secretKey) as { userId: number };

    // Verificar se o usuário existe no banco de dados
    const user = await prisma.userToLogin.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Incluir os dados do usuário decodificados no objeto de solicitação
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function getRegisterUsers(req: Request, res:Response){
    try {
      const users = await prisma.userToLogin.findMany({
          select: {
              username:true,
              email:true
          }
      });
      res.json(users);
    } catch (error) {
      console.log('error', error)
      res.status(500).json({ error: 'Erro ao obter os usuários.' });
    }
}


export async function registerUser(req: Request, res: Response) {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.userToLogin.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },

    });

    console.log('user', user)

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('erro aqui>>',error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await prisma.userToLogin.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
  const secretKey = process.env.JWT_SECRET;

  // Verificar se a chave secreta está definida
    if (!secretKey) {
      throw new Error('Secret key not found in .env file');
    }
    const token = jwt.sign({ userId: user.id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
