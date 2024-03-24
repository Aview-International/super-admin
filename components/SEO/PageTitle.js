import Head from 'next/head';

const PageTitle = ({ title, description }) => {
  return (
    <Head>
      <title>{`${title ? title + ' - ' : ''}Aview Admin`}</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/img/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/img/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/img/favicon/favicon-16x16.png"
      />
      <meta name="theme-color" content="#FC00FF" />
      <meta name="title" content={`${title ? title + ' - ' : ''}Aview Admin`} />
      <meta
        property="og:title"
        content={`${title ? title + ' - ' : ''}Aview Admin`}
      />
      {description ? (
        <>
          <meta name="description" content={description} />
          <meta name="og:description" content={description} />
        </>
      ) : (
        <>
          <meta
            name="description"
            content="AVIEW is a leading multi-media translation service. We help you expand your international viewership"
          />
          <meta
            property="og:description"
            content="AVIEW is a leading multi-media translation service. We help you expand your international viewership."
          />
        </>
      )}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://admin.aviewint.com/" />
      <meta property="og:image" content="/img/favicon/favicon-32x32.png" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="300" />
      <meta property="og:image:height" content="200" />
    </Head>
  );
};

export default PageTitle;
