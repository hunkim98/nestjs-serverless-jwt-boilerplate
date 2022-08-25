export const notificationHtml = ({
  title,
  nickname,
  description,
}: {
  title: string;
  nickname: string;
  description: string;
}) => {
  return `
  <html style="margin: 0; padding: 0">
  <head>
    <title>${title}</title>
  </head>

  <body style="margin: 0; padding: 0">
    <main style="width: 100%; max-width: 700px; margin: 0 auto">
      <div
        class="description"
        style="padding: 40px 0; font-size: 23px; line-height: 40px"
      >
        ${description}
      </div>
    </main>
  </body>
</html>
`;
};
