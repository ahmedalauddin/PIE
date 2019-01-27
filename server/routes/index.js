<<<<<<< HEAD

=======
>>>>>>> 7f0a7d3cbcf5fe9ad493818c72663a10843bab24
module.exports = (app) => {
    app.get('/api', (req, res) => res.status(200).send({
        message: 'Welcome to the Value Infinity MVP API!',
    }));
};