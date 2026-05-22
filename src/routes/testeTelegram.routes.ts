import { Router, Request, Response } from "express";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Teste Login Telegram</title>
            <style>body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f2f5; }</style>
        </head>
        <body>
            <!-- O script oficial do Telegram -->
            <script async src="https://telegram.org/js/telegram-widget.js?22" 
                    data-telegram-login="meu_alerta_promocoes_jogos_bot" 
                    data-size="large" 
                    data-auth-url="${process.env.BASE_URL}/api/auth/telegram/callback">
            </script>
        </body>
        </html>
    `;
  res.send(html);
});

export default router;