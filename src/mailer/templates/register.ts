export const registerHtml = ({
  title,
  nickname,
}: {
  title: string;
  nickname: string;
}) => {
  return `
  <html style="margin: 0; padding: 0">
  <head>
    <title>${title}</title>
  </head>

  <body style="margin: 0; padding: 0">
    <div>
      회원가입을 축하드립니다! ${nickname}님!
    </div>
  </body>
</html>

`;
};
