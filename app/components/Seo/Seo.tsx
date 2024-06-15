import React from "react";
import Head from "next/head";
import siteConfig from "@/config/site";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
}

const Seo = ({ title, description, image, url, keywords }: SeoProps) => {
  return (
    <>
      <title>{title ?? siteConfig.headline}</title>
      <meta
        name="description"
        content={description ?? siteConfig.description}
      />
      <meta name="keywords" content={keywords ?? siteConfig.keywords} />
      <meta name="image" content={image ?? siteConfig.image} />
      <meta name="url" content={url ?? siteConfig.domain} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />

      <meta property="og:title" content={title ?? siteConfig.headline} />
      <meta
        property="og:description"
        content={description ?? siteConfig.description}
      />
      <meta property="og:image" content={image ?? siteConfig.image} />
      <meta property="og:url" content={url ?? siteConfig.domain} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Caresync" />

      <meta property="twitter:title" content={title ?? siteConfig.headline} />
      <meta
        property="twitter:description"
        content={description ?? siteConfig.description}
      />
      <meta name="twitter:image" content={image ?? siteConfig.image} />
      <meta property="twitter:url" content={url ?? siteConfig.domain} />
      <meta property="twitter:type" content="website" />
      <meta name="twitter:site" content="@emmysoft_tm" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@emmysoft_tm" />

      <link rel="icon" href="/favicon.ico" />

      <meta name="apple-mobile-web-app-title" content="Caresync" />

      <meta name="msapplication-TileColor" content="#ffffff" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="application-name" content="Caresync" />
      <meta name="msapplication-TileImage" content="/logo.png" />
    </>
  );
};

export default Seo;
