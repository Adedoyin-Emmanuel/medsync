"use client";

import Button from "@/app/components/Button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Confetti from "react-confetti";
import Seo from "@/app/components/Seo/Seo";

const Verification = () => {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const message = searchParams.get("message");
  const userType = searchParams.get("userType");

  const link = userType ? `/${userType}/dashboard` : "/auth/login";

  return (
    <>
      <Seo
        title="Verify"
        description="Verify your caresync account"
        keywords="verify account, account verification"
      />
      {success == "true" && (
        <Confetti height={window?.innerHeight!} width={window?.innerWidth!} />
      )}

      <div className="w-screen h-screen flex items-center justify-center flex-col">
        {success == "true" ? (
          <>
            <h1 className="text-accent text-4xl capitalize font-bold my-5">
              Verification successful!
            </h1>
            <p className="text-success text-[18px] capitalize my-3">
              {message}
            </p>
            <Link href={link}>
              <Button>Go Home</Button>
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-accent text-4xl capitalize my-5 font-bold">
              Verification failed
            </h1>
            <p className="text-error text-[16px] capitalize my-5">{message}</p>
            <Link href={link}>
              <Button>Go Home</Button>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Verification;
