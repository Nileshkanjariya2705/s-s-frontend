import { REACT_APP_SITE_KEY } from "../config/index";
import { useEffect, useState } from "react";
declare global {
  interface Window {
    grecaptcha: any;
  }
}

const showBadge = () => {
  if (!window.grecaptcha) return;
  window.grecaptcha?.ready(() => {
    const badge = document.getElementsByClassName(
      "g-recaptcha"
    )[0] as HTMLElement;
    if (!badge) return;
    badge.style.display = 'block'
    badge.style.zIndex = '1'
  });
};

const hideBadge = () => {
  if (!window.grecaptcha) return;
  window.grecaptcha?.ready(() => {
    const badge = document.getElementsByClassName(
      "grecaptcha"
    )[0] as HTMLElement;
    if (!badge) return;
    badge.style.display = "none";
  });
};

const useReCaptcha = (): {
  reCaptchaLoaded: boolean;
  generateReCaptchaToken: (action: string) => Promise<string>;
} => {
  const hasRecaptcha = Boolean(REACT_APP_SITE_KEY);
  const [reCaptchaLoaded, setReCaptchaLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || reCaptchaLoaded || !hasRecaptcha) return;

    if (window.grecaptcha) {
      showBadge();
      setReCaptchaLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.google.com/recaptcha/api.js?render=${REACT_APP_SITE_KEY}`;
    script.addEventListener("load", () => {
      setReCaptchaLoaded(true);
      showBadge();
    });
    document.body.appendChild(script);
  }, [hasRecaptcha, reCaptchaLoaded]);

  useEffect(() => hideBadge, []);

  const generateReCaptchaToken = (action: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!hasRecaptcha) return resolve("");
      if (!reCaptchaLoaded) return reject(new Error("ReCaptcha not loaded"));
      if (typeof window === "undefined" || !window.grecaptcha) {
        setReCaptchaLoaded(false);
        return reject(new Error("ReCaptcha not loaded"));
      }
      
      window.grecaptcha?.ready(() => {
        window?.grecaptcha
          .execute(REACT_APP_SITE_KEY, { action })
          .then((token: string) => {
            localStorage.setItem(REACT_APP_SITE_KEY as string, token);
            resolve(token);
          });
      });
    });
  };

  return { reCaptchaLoaded, generateReCaptchaToken };
};

export default useReCaptcha;

// `https://www.recaptcha.net/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;

// export async function validateRecaptcha(recaptchaToken: string, expectedAction: string) : Promise<boolean> {
//     const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
//     const url = `https://www.recaptcha.net/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;
//     let valid = false;
//     await fetch(url, {method: 'post'})
//         .then((response: { json: () => any; }) => response.json())
//         .then((data: any)=> {
//             valid = (data.success && data.score && data.action && data.score >= threshold && data.action === expectedAction);
//         });
//     return valid;
// }
