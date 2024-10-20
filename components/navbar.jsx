'use client';

import { UserButton} from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation';

export function Navbar() {
    const router = useRouter();
    const pathName = usePathname();

    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <div className="container-fluid">

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <button className="custom-button-link">
                                <a className={`nav-link ${router.pathName === '/' ? 'active' : 'inactive'}`} onClick={() => router.push('/')}>Home</a>
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="custom-button-link">
                                <a className={`nav-link ${router.pathName === '/checkin' ? 'active' : 'inactive'}`} onClick={() => router.push('/checkin')}>Daily check-in</a>
                            </button>
                        </li>
                    </ul>

                    <UserButton />

                </div>

            </div>
        </nav>  
    )
}