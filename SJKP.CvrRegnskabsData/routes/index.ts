/*
 * GET home page.
 */
import express = require('express');
import cvrregnskab = require('../cvrregnskab');

export function index(req: express.Request, res: express.Response) {
    res.render('index', { title: 'Express' });
};

export function cvr(req: express.Request, res: express.Response) {
    cvrregnskab.get(req.params.cvr, (data) => {
        res.send(data);
    });
};