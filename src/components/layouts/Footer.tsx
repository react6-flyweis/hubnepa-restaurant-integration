import logoFoodMart from "@/assets/logo-food-mart.svg"
import { Link } from "react-router"

const partnerFooterLinks = [
  { label: "Privacy", to: "/#" },
  { label: "Terms", to: "/#" },
  { label: "Contact", to: "/#" },
]

export default function Footer() {
  return (
    <footer className="bg-[#020816]">
      <div className="flex flex-col gap-5 px-5 py-6 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <Link to="/" className="flex items-center">
          <img
            src={logoFoodMart}
            alt="Hubnepa Food and Mart"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="flex flex-wrap items-center gap-6 text-sm text-[#8F9AB7]">
          {partnerFooterLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-[#56627E]">© 2026 HUBNEPA.</p>
      </div>
    </footer>
  )
}
