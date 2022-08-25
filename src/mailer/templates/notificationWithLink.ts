export const notificationWithLinkHtml = ({
  title,
  nickname,
  description,
  url,
  buttonText,
}: {
  title: string;
  description: string;
  nickname: string;
  url: string;
  buttonText: string;
}) => {
  return `
  <html style="margin: 0; padding: 0">
  <head>
    <title>${title}</title>
  </head>

  <body style="margin: 0; padding: 0">
    <main>
      <div>
        ${description}
      </div>
      <br />
      <a
        class="link"
        href="${url}"
        target="_blank"
      >
        ${buttonText}
      </a>
    </main>
  </body>
</html>

  `;
};
