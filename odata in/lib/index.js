const { GetQueries } = require('../helpers/resolvers');

module.exports = function(RED) {
    function odataIn(config) {
        RED.nodes.createNode(this,config);
        this.name = config.name;
        var node = this;

        this.on('input', function(msg) {
            info={
                complete_url: msg.req.url,
                method: msg.req.method,
                resource_path: decodeURI(msg.req._parsedUrl.pathname),
                query_params: msg.req.query,
                body: msg.req.body
            };

            GetQueries(info)
            .then(queries => {
                msg.payload.queries = queries
                msg.payload.info = info
                node.send(msg)
            });
        });
    }
    RED.nodes.registerType("odata in",odataIn);
};