import { useRef, useState } from "react";

import styles from "./ErrorPage.module.scss";

export const ErrorPage = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isMessageSent, setMessageSent] = useState<boolean>(false);

  const handleSendMessage = async () => {
    if (inputRef.current?.value.length === 0) return;

    const messageText =
      `‼️ Ошибка в приложении. Текст сообщения: ${"_".repeat(67)} ` +
      inputRef.current?.value;

    try {
      const token = "6609085481:AAFdsGSUbKzsM_zB-pEz9x5j809R2CnTM5U";
      const chat_id = "-1001670491337";
      await fetch(
        `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chat_id}&parse_mode=html&text=${messageText}`,
      );

      setMessageSent(true);

      setTimeout(() => {
        window.location.href = "/";
      }, 10000);
    } catch (error) {
      console.log(error);
    }
  };

  const fullReload = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={styles.ErrorPage}>
      <div className={styles.content}>
        <h1>Упс.. Что-то пошло не так.</h1>

        <h2>Расскажите, что вы делали прежде чем это произошло?</h2>

        <textarea ref={inputRef}></textarea>

        {isMessageSent && (
          <div className={styles.helpfulText}>
            <h2>
              Большое спасибо за обратную связь! Если хотите помочь ещё больше
              -- напишите нам по контактам.
              <a href="https://vk.com/http_401">(https://vk.com/http_401)</a>
            </h2>

            <p>
              Через 10 секунд вы будете перенаправлены на главную страницу..
            </p>
          </div>
        )}

        <div className={styles.sendButton}>
          <button
            style={{ backgroundColor: "green" }}
            onClick={handleSendMessage}
            disabled={isMessageSent}
          >
            Отправить отчёт и вернуться на главную
          </button>
        </div>

        <div className={styles.reloadButton}>
          <button onClick={() => location.reload()}>
            Вернуться на главную
          </button>
          <button onClick={fullReload} style={{ backgroundColor: "#df5858" }}>
            Очистить кэш (не рекомендуется)
          </button>
        </div>
      </div>
    </div>
  );
};
