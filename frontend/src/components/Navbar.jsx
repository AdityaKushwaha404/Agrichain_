import React, { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import BlackboxCopilot from './BlackboxCopilot';
import { useLocation, useNavigate } from 'react-router-dom';
import Chatbot from "../Chatbot";

const navLinks = [
	{ name: "Home", href: "#home", id: 'home' },
	{ name: "Features", href: "#features", id: 'features' },
	{ name: "About", href: "#about", id: 'about' },
	{ name: "Contact", href: "#contact", id: 'contact' },
];

const Navbar = ({ onDashboardMenuToggle, showDashboardMenu = false }) => {
	const [scrolled, setScrolled] = useState(false);
	const [active, setActive] = useState("Home");
	const [copilotOpen, setCopilotOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isDashboardRoute = location.pathname.startsWith('/transparency');

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll);
		// Intersection Observer for active link
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const id = entry.target.getAttribute('id');
						const match = navLinks.find(l => l.id === id);
						if (match) setActive(match.name);
					}
				});
			},
			{ rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 1] }
		);
		navLinks.forEach(l => {
			const el = document.getElementById(l.id);
			if (el) observer.observe(el);
		});
		return () => {
			window.removeEventListener("scroll", onScroll);
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		if (isDashboardRoute) {
			setMobileMenuOpen(false);
		}
	}, [isDashboardRoute]);

	const handleNavClick = (name, href, e) => {
		e.preventDefault();
		setMobileMenuOpen(false);
		const id = href.replace('#','');
		setActive(name);
		const onHome = location.pathname === '/' || location.pathname === '';
		if (!onHome) {
			navigate('/' + href); // navigates to /#section
			// delay scroll until after route change render
			setTimeout(() => {
				const target = document.getElementById(id);
				if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 60);
		} else {
			const target = document.getElementById(id);
			if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
		setTimeout(() => {
			const target = document.getElementById(id);
			if (target) target && target.setAttribute('tabindex','-1');
		}, 120);
	};

	const handleRipple = (e) => {
		if (window.innerWidth <= 767) return;
		const btn = e.currentTarget;
		const ripple = document.createElement("span");
		ripple.className = "ripple";
		ripple.style.left = e.nativeEvent.offsetX + "px";
		ripple.style.top = e.nativeEvent.offsetY + "px";
		btn.appendChild(ripple);
		setTimeout(() => ripple.remove(), 600);
	};

	const handleLogoClick = () => {
		if (location.pathname !== '/') {
			navigate('/');
			setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 40);
		} else {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
		setActive('Home');
	};

	return (
		<nav
			className={`top-0 z-50 transition-all duration-500 ${
				scrolled
					? "fixed inset-x-0 bg-white/55 backdrop-blur-xl shadow-[0_4px_32px_-4px_rgba(0,0,0,0.08)] border-b border-white/30 py-2 supports-[backdrop-filter]:backdrop-saturate-150"
					: "absolute inset-x-0 bg-transparent py-5"
			}`}
			style={{
				transitionProperty: 'background,backdrop-filter,box-shadow,padding',
			}}
		>
			<div className="nav-row max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex justify-between items-center gap-1.5 sm:gap-2 transition-all duration-500">
				<div className="brand-wrap flex items-center gap-1 sm:gap-2 select-none cursor-pointer group focus:outline-none min-w-0" role="button" tabIndex={0} onClick={handleLogoClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleLogoClick(); } }}>
					<span className="brand-icon text-xl sm:text-2xl mr-0 sm:mr-1 transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
						<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="14" cy="14" r="14" fill="#e0ffe6"/>
							<path d="M10.5 17.5l7-7" stroke="#22c55e" strokeWidth="2.2" strokeLinecap="round"/>
							<path d="M13.5 10.5a3 3 0 0 1 4.24 4.24l-2.12 2.12a3 3 0 0 1-4.24-4.24l.7-.7" stroke="#14b8a6" strokeWidth="2.2" strokeLinecap="round"/>
						</svg>
					</span>
					<span className="brand-title text-[1.9rem] sm:text-2xl font-extrabold bg-gradient-to-r from-green-600 via-teal-400 to-green-400 bg-clip-text text-transparent tracking-tight transition-transform duration-300 group-hover:scale-105 group-active:scale-95 truncate">AgriChain</span>
				</div>
				<div className="hidden md:flex items-center gap-2">
					{navLinks.map((link) => (
						<a
							key={link.name}
							href={link.href}
							onClick={(e) => handleNavClick(link.name, link.href, e)}
							className={`relative px-6 py-1 font-medium transition text-lg nav-link group ${
								active === link.name
									? "text-green-700 font-bold"
									: "text-gray-800"
							}`}
						>
							<span>{link.name}</span>
							<span className="nav-underline absolute left-0 bottom-0 h-0.5 w-0 bg-gradient-to-r from-green-400 via-teal-400 to-green-600 transition-all duration-300 group-hover:w-full group-hover:h-0.5 rounded-full"></span>
						</a>
					))}
				</div>
				<div className="nav-actions ml-1 md:ml-4 flex items-center gap-1.5 md:gap-3 shrink-0">
					<button
						className="hidden md:inline-flex hero-btn-gradient-border relative font-semibold py-2 px-4 sm:px-7 rounded-full shadow-lg transition duration-300 text-white overflow-hidden focus:outline-none text-sm sm:text-base scale-100 hover:scale-105"
						onClick={(e) => { handleRipple(e); navigate('/transparency'); }}
					>
						<span className="relative z-10 whitespace-nowrap">Explore Now</span>
						<span className="hero-btn-border absolute inset-0 rounded-full pointer-events-none"></span>
					</button>

					

					<Chatbot />

					{/* Auth controls */}
					<SignedOut>
						<SignInButton mode="modal" afterSignInUrl="/" afterSignUpUrl="/">
							<button
								aria-label="Log in"
								onClick={handleRipple}
								className="login-btn relative overflow-hidden rounded-full px-3 sm:px-6 py-2 font-semibold text-gray-800 focus:outline-none transition-all duration-300 text-sm sm:text-base"
							>
								<span className="relative z-10 flex items-center gap-2">
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
										<path d="M8 10V7a4 4 0 1 1 8 0v3" stroke="#0f766e" strokeWidth="1.8" strokeLinecap="round"/>
										<rect x="5" y="10" width="14" height="10" rx="3" stroke="#22c55e" strokeWidth="1.8"/>
									</svg>
									<span className="login-label whitespace-nowrap leading-none">Log in</span>
								</span>
								<span className="login-btn-border absolute inset-0 rounded-full pointer-events-none" />
								<span className="login-btn-glow absolute inset-0 rounded-full pointer-events-none" />
							</button>
						</SignInButton>
					</SignedOut>
					<SignedIn>
						<UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: 'ring-2 ring-teal-400' } }} />
					</SignedIn>
					<button
						type="button"
						className="menu-toggle md:hidden p-2 rounded-lg border border-emerald-200 text-emerald-700"
						onClick={() => {
							if (isDashboardRoute && showDashboardMenu && onDashboardMenuToggle) {
								onDashboardMenuToggle();
								return;
							}
							setMobileMenuOpen((prev) => !prev);
						}}
						aria-label="Toggle menu"
						hidden={isDashboardRoute && !showDashboardMenu}
					>
						<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</div>
			{mobileMenuOpen && !isDashboardRoute && (
				<div className="md:hidden mt-2 mx-4 rounded-2xl border border-emerald-100 bg-white/95 p-2 shadow-sm">
					{navLinks.map((link) => (
						<a
							key={link.name}
							href={link.href}
							onClick={(e) => handleNavClick(link.name, link.href, e)}
							className={`block px-3 py-2 rounded-lg text-sm font-medium ${
								active === link.name ? 'text-green-700 bg-emerald-50' : 'text-gray-700'
							}`}
						>
							{link.name}
						</a>
					))}
				</div>
			)}
			<BlackboxCopilot open={copilotOpen} onClose={() => setCopilotOpen(false)} />
			<style>{`
				.nav-link { overflow: hidden; }
				.nav-underline { position: absolute; left:0; bottom:0; width:0%; height:2px; background: linear-gradient(90deg,#22c55e,#2dd4bf,#14b8a6); transition: width .35s cubic-bezier(.4,0,.2,1), height .2s; }
				.nav-link:hover .nav-underline { width:100%; }
				.hero-btn-gradient-border { background: linear-gradient(90deg,#22c55e 0%,#2dd4bf 100%); position:relative; z-index:1; transition: transform .18s cubic-bezier(.4,2,.6,1), box-shadow .18s; }
				.hero-btn-gradient-border .ripple { position:absolute; border-radius:9999px; transform:translate(-50%,-50%); pointer-events:none; width:10px; height:10px; background:rgba(255,255,255,0.5); animation:rippleEffect .6s linear; z-index:2; }
				.hero-btn-border { content:''; display:block; border-radius:9999px; padding:2px; background:linear-gradient(270deg,#22c55e,#2dd4bf,#14b8a6,#22c55e); background-size:400% 400%; z-index:1; animation:borderGradientMove 4s linear infinite; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite:xor; mask-composite:exclude; transition:filter .18s, box-shadow .18s; }
				.hero-btn-gradient-border:hover { background:linear-gradient(270deg,#22c55e,#2dd4bf,#14b8a6,#22c55e); background-size:400% 400%; animation:btnFillGradientMove 2.5s linear infinite; transform:scale(1.06); box-shadow:0 0 0 4px #2dd4bf33,0 4px 32px 0 #2dd4bf66,0 0 8px 2px #fff8; }
				.hero-btn-gradient-border:hover .hero-btn-border { filter:brightness(1.15) drop-shadow(0 0 12px #2dd4bfcc); }

				/* Login button with translucent pill + animated gradient border */
				.login-btn { background: linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.6)); box-shadow: 0 10px 24px -14px rgba(16,185,129,0.35), inset 0 1px 0 0 rgba(255,255,255,0.8); backdrop-filter: blur(8px); }
				.login-btn:hover { transform: translateY(-1px); }
				.login-btn:active { transform: translateY(0); }
				.login-btn-border { content:''; display:block; border-radius:9999px; padding:1.5px; background:linear-gradient(120deg,#94f2c0,#2dd4bf,#22c55e,#94f2c0); background-size:300% 300%; animation:borderGradientMove 6s linear infinite; -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; }
				.login-btn-glow { opacity:0; box-shadow:0 6px 30px -10px rgba(45,212,191,0.5), 0 0 0 1px rgba(20,184,166,0.12) inset; transition: opacity .25s ease; }
				.login-btn:hover .login-btn-glow { opacity:1; }
				@keyframes btnFillGradientMove { 0% {background-position:0% 50%;} 100% {background-position:100% 50%;} }
				@keyframes borderGradientMove { 0% {background-position:0% 50%;} 100% {background-position:100% 50%;} }
				@keyframes rippleEffect { 0% {opacity:.7;width:10px;height:10px;} 80% {opacity:.3;width:120px;height:120px;} 100% {opacity:0;width:160px;height:160px;} }
				@media (max-width: 767px) {
					.nav-row {
						width: 100%;
						min-width: 0;
						overflow-x: clip;
					}
					.brand-wrap {
						flex: 1 1 0%;
						min-width: 0;
						max-width: 100%;
					}
					.brand-title {
						font-size: 1.6rem;
						line-height: 1;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.brand-icon {
						display: none;
					}
					.nav-actions {
						flex: 0 0 auto;
						gap: 0.375rem;
					}
					.login-btn {
						padding-left: 0.6rem;
						padding-right: 0.6rem;
					}
					.menu-toggle {
						padding: 0.42rem;
					}
					.login-label {
						display: none;
					}
					.hero-btn-gradient-border,
					.login-btn {
						box-shadow: none;
					}
					.hero-btn-border,
					.login-btn-border,
					.login-btn-glow {
						display: none;
					}
				}
			`}</style>
		</nav>
	);
};

export default Navbar;