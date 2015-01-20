var request = require('request');
var cheerio = require('cheerio');

module cvrregnskab {
    export function get(cvr, cb) {
        request.get('http://datacvr.virk.dk/data/visenhed?enhedstype=virksomhed&id='+cvr, (err, req, body) => {
            var $ = cheerio.load(body);
            var regnskabdata = $('#collapse_-Regnskaber-og-nøgletal');
            var data = {};

            data['cvr'] = cvr;
            data['kapital'] = $('.persondata .col-sm-8', regnskabdata).text();
            data['regnskabsaar'] = $('.regnskabsår', regnskabdata).text();
            data['regnskaber'] = [];

            $('.row', regnskabdata).each((i, o) => {
                if (i > 2) {
                    var row = $(o);
                    var downloadLinks = $('#downloadXBRL', row);
                    if (downloadLinks.length > 0) {
                        var regnskab = {};
                        regnskab['periode'] = $($('div', row)[1]).text();
                        regnskab['offentliggjort'] = $($('div', row)[2]).text();

                        regnskab['pdfurl'] = $(downloadLinks[0]).attr('href');
                        regnskab['xbrlurl'] = $(downloadLinks[1]).attr('href');
                        data['regnskaber'].push(regnskab);
                    }
                }
            });

            cb(data);
        });
    };
};

export = cvrregnskab;

