import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO } from '../DTO/user.dto';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
        select: {
            name:true,
            email:true
        }
    });
    res.json(users);
  } catch (error) {
    console.log('error', error)
    res.status(500).json({ error: 'Erro ao obter os usuários.' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body as CreateUserDTO;
  try {
    const user = await prisma.user.create({
      data: { name, email, password },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o usuário.' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, email, password } = req.body as UpdateUserDTO;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, password },
      select: {
        name:true,
        email:true 
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o usuário.' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: 'Usuário excluído com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir o usuário.' });
  }
};
