module.exports = function decodeHeader(header) {

    if (header != null && header.length != 0) {
        try {
            const basicToken = header.split(' ')[1];
            const decodedHeader = Buffer.from(basicToken, 'base64').toString('ascii').split(':');
            
            return {
                email: decodedHeader[0],
                outlookId: decodedHeader[1],
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    } else {
        throw new Error();
    }

}