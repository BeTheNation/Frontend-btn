"use client";

export function FaucetButton() {
  return (
    <a
      href="https://docs.base.org/chain/network-faucets"
      target="_blank"
      rel="noopener noreferrer"
      className="px-[20.82px] py-[13.01px] bg-gradient-to-br from-[#111214] to-[#22242a] rounded-[80.08px] shadow-[-9.609195709228516px_-9.609195709228516px_19.21839141845703px_0px_rgba(21,94,239,0.24)] shadow-[9.609195709228516px_9.609195709228516px_19.21839141845703px_0px_rgba(255,175,41,0.24)] outline outline-[2.40px] outline-[#155dee] inline-flex justify-center items-center gap-[10.41px] overflow-hidden text-white cursor-pointer hover:bg-gradient-to-br hover:from-[#3074fc] hover:to-[#1243d6] transition-colors duration-300 ease-in-out hover:scale-[1.03] active:scale-[0.98] transition-transform transform"
    >
      Faucet
    </a>
  );
}
