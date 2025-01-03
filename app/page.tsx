
import Image from "next/image";
import Link from "next/link";

export default async function Hero() {
  return (
    <section className="text-center flex overflow-hidden flex-col items-center justify-center mt-10">
      <Image
        className="flex items-center justify-center ml-40 mb-5"
        src="/images/head-logo.png"
        alt="Hero"
        width={700}
        height={600}
      />
      <h1 className="text-5xl font-bold mb-6 leading-tight">
        Evaluation made simple
        <br />
        for people like you
      </h1>
      <p className="text-gray-600">
        Most evaluation apps just like google forms are simple but ours is even
        more simple.
        <br />
        On top of this, it&apos;s for CBSUA only and it&apos;s more secured.
      </p>
      <p className="mt-3 font-semibold">Are you a?</p>
      <div className="mt-4 flex gap-4 justify-center flex-wrap">
        <Link
          href="/auth/student/login"
          className="bg-black text-white py-2 px-4 rounded-full"
        >
          Student
        </Link>
        <Link href="/auth/faculty/login" className="bg-black text-white py-2 px-4 rounded-full">
          Faculty
        </Link>
        <Link href="/auth/non-teaching/login" className="bg-black text-white py-2 px-4 rounded-full">
          Non-Teaching
        </Link>
        <Link href="/auth/supervisor/login" className="bg-black text-white py-2 px-4 rounded-full">
          Supervisor
        </Link>
      </div>
      <div className="relative shadow-xl md:w-[1200px] w-full ring-4 ring-[#777] bg-[#222222] h-[500px] overflow-hidden border-[15px] rounded-lg border-[#222222] mt-8 flex items-center justify-center mx-auto">
        <Image
          className="w-full object-cover h-full border-[10px] border-[#18181b] bg-black rounded-lg"
          src="/images/hero.png"
          alt="Hero"
          fill
        />
      </div>
    </section>
  );
}
