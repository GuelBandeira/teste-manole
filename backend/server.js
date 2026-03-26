import app from './app.js';
const PORT = 3005;

app.get('/', (req, res) => {
   res.send('Teste Manole API');
});

app.listen(PORT, () => {
   console.log(`API está rodando na porta ${PORT}`);
});

export default app;