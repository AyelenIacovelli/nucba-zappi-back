import { Request, Response } from "express";
import Issue, { IIssue } from "../models/issue";
import { ObjectId } from "mongoose";

export const postNewIssue = async (req: Request, res: Response) => {
    //para sacar la data del body me armo en postman. primero en headers escribo x-token y el value que ya tenia. en body: lo que indique en el modelo. Save as - CreateIssue
    const { title, description, priority }: IIssue = req.body
    const usuarioId: ObjectId = req.body.usuarioConfirmado._id

    const issueData = {
        title,
        description,
        priority,
        createAt: new Date(),
        user: usuarioId
    }
    const issue = new Issue(issueData)
    await issue.save()
    res.status(201).json({
        issue
    })
} 