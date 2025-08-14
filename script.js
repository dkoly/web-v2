document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingScreen();
    initializeNavigation();
    initializeAnimations();
    initializeParticleSystem();
    initializeTerminalAnimation();
    initializeLabs();
});

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            navLinks.forEach(nl => nl.classList.remove('active'));
            this.classList.add('active');
            
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                    triggerSectionAnimation(section);
                }
            });
        });
    });

    window.addEventListener('scroll', updateNavOnScroll);
}

function updateNavOnScroll() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        if (section.classList.contains('active')) {
            currentSection = section.id;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateElements(entry.target);
                
                // Trigger counter animation for metrics
                if (entry.target.classList.contains('achievement-metrics')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.skill-category, .cert-badge, .timeline-item, .achievement-metrics, .box-card, .lab-stat').forEach(el => {
        observer.observe(el);
    });
}

function animateElements(container) {
    const timeline = container.querySelectorAll('.timeline-item');
    const skills = container.querySelectorAll('.skill-category');
    const badges = container.querySelectorAll('.cert-badge');
    const labStats = container.querySelectorAll('.lab-stat');
    
    timeline.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 300);
    });
    
    skills.forEach((skill, index) => {
        setTimeout(() => {
            skill.style.opacity = '1';
            skill.style.transform = 'translateX(0)';
        }, index * 300);
    });
    
    badges.forEach((badge, index) => {
        setTimeout(() => {
            badge.style.opacity = '1';
            badge.style.transform = 'scale(1)';
        }, index * 150);
    });
    
    labStats.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.opacity = '1';
            stat.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

function triggerSectionAnimation(section) {
    const animatedElements = section.querySelectorAll('.skill-category, .cert-badge, .timeline-item, .lab-stat');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
    });
    
    setTimeout(() => {
        animateElements(section);
        // Special handling for labs section
        if (section.id === 'labs') {
            animateCounters();
        }
    }, 100);
}

function initializeParticleSystem() {
    const heroContainer = document.querySelector('.hero-container');
    if (!heroContainer) return;
    
    for (let i = 0; i < 15; i++) {
        createFloatingParticle(heroContainer);
    }
}

function createFloatingParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('floating-particle');
    
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 10 + 15;
    const delay = Math.random() * 5;
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(0,255,255,0.8) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: floatParticle ${duration}s linear infinite ${delay}s;
        z-index: 1;
    `;
    
    container.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createFloatingParticle(container);
        }
    }, (duration + delay) * 1000);
}

function initializeTerminalAnimation() {
    const terminal = document.getElementById('terminal-body');
    if (!terminal) return;
    
    const scenarios = [
        {
            command: 'nmap -sS -O 192.168.1.0/24',
            outputs: [
                'Starting Nmap 7.94 ( https://nmap.org )',
                'Nmap scan report for 192.168.1.1',
                'Host is up (0.001s latency).',
                'PORT     STATE SERVICE',
                '22/tcp   open  ssh',
                '80/tcp   open  http',
                '443/tcp  open  https'
            ],
            finalOutput: 'Nmap done: 254 IP addresses scanned'
        },
        {
            command: 'gobuster dir -u https://target.com -w common.txt',
            outputs: [
                'Gobuster v3.6',
                'by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)',
                '===============================================================',
                'Starting gobuster in directory enumeration mode'
            ],
            finalOutput: 'Found 12 directories - scan complete'
        },
        {
            command: 'nikto -h https://target.com',
            outputs: [
                '- Nikto v2.5.0',
                '+ Target IP:          10.0.0.1',
                '+ Target Hostname:    target.com',
                '+ Scanning target.com...'
            ],
            finalOutput: '+ Server: nginx/1.18.0 - scan complete'
        }
    ];
    
    let currentScenario = 0;
    
    function runTerminalScenario() {
        const scenario = scenarios[currentScenario];
        
        // Clear terminal except for the prompt
        terminal.innerHTML = `
            <div class="terminal-line">
                <span class="prompt">root@security:~$</span>
                <span class="cursor">_</span>
            </div>
        `;
        
        const currentLine = terminal.querySelector(".terminal-line");
        const cursor = currentLine.querySelector(".cursor");
        
        // Type the command
        setTimeout(() => {
            cursor.style.display = "none";
            const commandSpan = document.createElement("span");
            commandSpan.className = "command";
            currentLine.insertBefore(commandSpan, cursor);
            
            typeWriter(commandSpan, scenario.command, () => {
                // After command is typed, show outputs
                setTimeout(() => {
                    showOutputs(scenario.outputs, scenario.finalOutput);
                }, 500);
            });
        }, 1000);
    }
    
    function showOutputs(outputs, finalOutput) {
        let outputIndex = 0;
        
        function showNextOutput() {
            if (outputIndex < outputs.length) {
                const outputLine = document.createElement("div");
                outputLine.className = "terminal-line";
                outputLine.innerHTML = `<span class="output">${outputs[outputIndex]}</span>`;
                terminal.appendChild(outputLine);
                outputIndex++;
                setTimeout(showNextOutput, 300);
            } else {
                // Show final output
                setTimeout(() => {
                    const finalLine = document.createElement("div");
                    finalLine.className = "terminal-line";
                    finalLine.innerHTML = `<span class="output success">${finalOutput} ✓</span>`;
                    terminal.appendChild(finalLine);
                    
                    // Add new prompt
                    setTimeout(() => {
                        const newPromptLine = document.createElement("div");
                        newPromptLine.className = "terminal-line";
                        newPromptLine.innerHTML = `
                            <span class="prompt">root@security:~$</span>
                            <span class="cursor">_</span>
                        `;
                        terminal.appendChild(newPromptLine);
                        
                        // Move to next scenario
                        currentScenario = (currentScenario + 1) % scenarios.length;
                        setTimeout(runTerminalScenario, 3000);
                    }, 1000);
                }, 800);
            }
        }
        
        showNextOutput();
    }
    
    // Start the first scenario after initial delay
    setTimeout(runTerminalScenario, 3000);
}

function typeWriter(element, text, callback) {
    element.textContent = '';
    let i = 0;
    
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
            if (callback) setTimeout(callback, 2000);
        }
    }, 100);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(100vh) translateX(0px) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) translateX(100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    .skill-category, .cert-badge, .timeline-item {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .lab-stat {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .skill-category {
        transform: translateX(-30px);
    }
    
    .cert-badge {
        transform: scale(0.8);
    }
    
    .floating-particle {
        filter: blur(0.5px);
    }
    
    .hero-title .title-line:nth-child(1) {
        animation-delay: 0.5s;
    }
    
    .hero-title .title-line:nth-child(2) {
        animation-delay: 1s;
    }
    
    .shape-1, .shape-2, .shape-3, .shape-4 {
        opacity: 0.7;
    }
    
    .shape-1:hover, .shape-2:hover, .shape-3:hover, .shape-4:hover {
        opacity: 1;
        transform: scale(1.1);
        transition: all 0.3s ease;
    }
    
    @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    }
`;
document.head.appendChild(style);

document.addEventListener('mousemove', function(e) {
    const nodes = document.querySelectorAll('.cyber-node');
    nodes.forEach((node, index) => {
        const speed = (index + 1) * 0.02;
        const x = (e.clientX - window.innerWidth / 2) * speed;
        const y = (e.clientY - window.innerHeight / 2) * speed;
        
        node.style.transform = `translate(${x}px, ${y}px) scale(${1 + Math.abs(x) * 0.001})`;
    });
});

window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const nodes = document.querySelectorAll('.cyber-node');
    
    nodes.forEach((node, index) => {
        const speed = (index + 1) * 0.3;
        node.style.transform = `translateY(${scrolled * speed}px) scale(${1 + scrolled * 0.0001})`;
    });
});

function addGlitchEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    
    // Glitch effect every 5 seconds
    setInterval(() => {
        heroTitle.style.textShadow = `
            2px 0 #ff0080,
            -2px 0 #00ffff,
            0 0 10px rgba(0,255,255,0.5)
        `;
        heroTitle.style.animation = 'glitchBlink 0.3s ease';
        
        setTimeout(() => {
            heroTitle.style.textShadow = 'none';
            heroTitle.style.animation = '';
        }, 300);
    }, 5000);
}

addGlitchEffect();

function animateCounters() {
    const counters = document.querySelectorAll('.metric-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100; // Animation duration control
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                
                // Format numbers appropriately
                if (target >= 1000) {
                    counter.textContent = Math.floor(current).toLocaleString();
                } else {
                    counter.textContent = Math.floor(current);
                }
                
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target >= 1000 ? target.toLocaleString() : target;
            }
        };
        
        // Add entrance animation
        counter.style.animation = 'countUp 0.6s ease forwards';
        
        // Start counting after a brief delay
        setTimeout(updateCounter, 200);
    });
}

function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    const bootMessages = document.getElementById('boot-messages');
    const loadingProgress = document.getElementById('loading-progress');
    const loadingPercentage = document.getElementById('loading-percentage');
    
    const bootSequence = [
        'INITIALIZING SECURITY PROTOCOLS...',
        'LOADING THREAT DETECTION MODULES...',
        'ESTABLISHING SECURE CONNECTION...',
        'VERIFYING DIGITAL CERTIFICATES...',
        'ACTIVATING FIREWALL PROTECTION...',
        'SCANNING SYSTEM INTEGRITY...',
        'LOADING CYBERSECURITY PORTFOLIO...',
        'AUTHENTICATION COMPLETE ✓'
    ];
    
    let currentStep = 0;
    let progress = 0;
    
    function showNextBootMessage() {
        if (currentStep < bootSequence.length) {
            const bootLine = document.createElement('div');
            bootLine.className = 'boot-line typing';
            bootLine.textContent = bootSequence[currentStep];
            bootMessages.appendChild(bootLine);
            
            // Remove typing class after a brief moment
            setTimeout(() => {
                bootLine.classList.remove('typing');
            }, 800);
            
            // Update progress
            progress = Math.floor(((currentStep + 1) / bootSequence.length) * 100);
            loadingProgress.style.width = progress + '%';
            loadingPercentage.textContent = progress + '%';
            
            currentStep++;
            
            // Continue to next message
            if (currentStep < bootSequence.length) {
                setTimeout(showNextBootMessage, 600);
            } else {
                // Loading complete, fade out after brief delay
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    // Remove from DOM after transition
                    setTimeout(() => {
                        loadingScreen.remove();
                    }, 500);
                }, 800);
            }
        }
    }
    
    // Start boot sequence after brief delay
    setTimeout(showNextBootMessage, 1000);
}

// Boxes data structure - easily maintainable
const boxesData = [
    {
        name: "Beep",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Directory Traversal", "Shellshock", "SSH Bruteforce"],
        steps: [
            "Initial foothold: Exploited Elastix LFI vulnerability to read /etc/passwd and extract credentials",
            "Privilege escalation: Used shellshock vulnerability on port 10000 to execute commands as root",
            "Key learning: Multiple attack vectors including LFI, credential harvesting, and shellshock exploitation"
        ]
    },
    {
        name: "Doctor",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["SSTI", "Log Poisoning", "Splunk Forwarder"],
        steps: [
            "Initial foothold: Server-Side Template Injection (SSTI) in Jinja2 template engine via blog message",
            "Privilege escalation: Exploited Splunk forwarder running as root using SplunkWhisperer2",
            "Key learning: SSTI detection and exploitation, plus privilege escalation via misconfigured services"
        ]
    },
    {
        name: "Sense",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["CVE-2014-4688", "pfSense", "Directory Enumeration"],
        steps: [
            "Initial foothold: Found system-users.txt via directory enumeration on pfSense system",
            "Privilege escalation: Exploited CVE-2014-4688 in pfSense to gain shell access",
            "Key learning: Importance of directory enumeration and researching CVEs for specific software versions"
        ]
    },
    {
        name: "Admirer",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["FTP Enumeration", "Database Credentials", "Python Library Hijacking"],
        steps: [
            "Initial foothold: Enumerated FTP to find backup files containing database credentials",
            "Privilege escalation: Exploited sudo rights on admin script using Python library hijacking",
            "Key learning: Credential reuse across services and Python path manipulation for privilege escalation"
        ]
    },
    {
        name: "Blocky",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["JAR File Analysis", "Password Reuse", "Sudo Privileges"],
        steps: [
            "Initial foothold: Reverse engineered JAR files to extract hardcoded database credentials",
            "Privilege escalation: Reused password for SSH access, then leveraged full sudo privileges",
            "Key learning: Reverse engineering compiled files and avoiding password reuse across accounts"
        ]
    },
    {
        name: "Blunder",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Bludit CMS", "Brute Force Bypass", "CVE-2019-14287"],
        steps: [
            "Initial foothold: Bypassed Bludit CMS brute force protection and exploited directory traversal",
            "Privilege escalation: Exploited sudo vulnerability CVE-2019-14287 using user ID -1",
            "Key learning: CMS-specific vulnerabilities and sudo version exploits for privilege escalation"
        ]
    },
    {
        name: "Friendzone",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["SMB Enumeration", "DNS Zone Transfer", "LFI"],
        steps: [
            "Initial foothold: Found credentials via SMB shares and performed DNS zone transfer for subdomain discovery",
            "Privilege escalation: Uploaded reverse shell via SMB and included it through LFI vulnerability",
            "Key learning: Multi-protocol enumeration and chaining SMB access with web vulnerabilities"
        ]
    },
    {
        name: "Frolic",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["OOK Cipher", "PlaySMS RCE", "Buffer Overflow"],
        steps: [
            "Initial foothold: Decoded OOK cipher and cracked ZIP files to access PlaySMS with RCE vulnerability",
            "Privilege escalation: Attempted buffer overflow on custom SUID binary but escalation incomplete",
            "Key learning: Multi-layer decoding challenges and identifying custom binaries for privilege escalation"
        ]
    },
    {
        name: "Irked",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["UnrealIRCD Backdoor", "Steganography", "SUID Exploitation"],
        steps: [
            "Initial foothold: Exploited UnrealIRCD 3.2.8.1 backdoor vulnerability for command execution",
            "Privilege escalation: Used steganography to extract password, then exploited custom SUID binary",
            "Key learning: IRC service exploitation and combining steganography with binary exploitation"
        ]
    },
    {
        name: "Mirai",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Default Credentials", "Pi-hole", "USB Recovery"],
        steps: [
            "Initial foothold: SSH access using default Raspberry Pi credentials (pi/raspberry)",
            "Privilege escalation: Already had sudo access, found root flag in attached USB device",
            "Key learning: IoT device security and the importance of changing default credentials"
        ]
    },
    {
        name: "Networked",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["File Upload Bypass", "Cron Job", "Network Script Injection"],
        steps: [
            "Initial foothold: Bypassed file upload validation using GIF magic bytes with PHP backdoor",
            "Privilege escalation: Exploited network configuration script via command injection in interface names",
            "Key learning: File upload filter bypasses and command injection in system configuration scripts"
        ]
    },
    {
        name: "OpenAdmin",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["OpenNetAdmin RCE", "SSH Key Cracking", "Nano GTFOBins"],
        steps: [
            "Initial foothold: Exploited OpenNetAdmin 18.1.1 RCE vulnerability for initial shell access",
            "Privilege escalation: Cracked SSH private key password and exploited nano sudo privileges",
            "Key learning: Web application CVE exploitation and GTFOBins for breaking out of restricted commands"
        ]
    },
    {
        name: "Postman",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Redis Exploitation", "SSH Key Upload", "Webmin RCE"],
        steps: [
            "Initial foothold: Exploited unauthenticated Redis to upload SSH public key for access",
            "Privilege escalation: Used cracked SSH key password to access Webmin and exploit RCE vulnerability",
            "Key learning: Redis security misconfigurations and credential reuse across different services"
        ]
    },
    {
        name: "Shoppy",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["NoSQL Injection", "Password Cracking", "Docker Escape"],
        steps: [
            "Initial foothold: NoSQL injection bypass on login page to access admin panel and extract hashes",
            "Privilege escalation: Used cracked credentials to access Mattermost, then Docker escape for root",
            "Key learning: NoSQL injection techniques and Docker container escape methods"
        ]
    },
    {
        name: "Sunday",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Finger Enumeration", "Password Cracking", "Sudo Wget"],
        steps: [
            "Initial foothold: Used finger service to enumerate users, then brute forced SSH with default passwords",
            "Privilege escalation: Exploited sudo wget permissions to read root flag directly",
            "Key learning: User enumeration via finger service and creative use of sudo file read permissions"
        ]
    },
    {
        name: "Swagshop",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Magento CMS", "Admin Creation", "RCE Attempts"],
        steps: [
            "Initial foothold: Used Magento exploits to create admin account on CMS",
            "Privilege escalation: Multiple RCE attempts failed including authenticated exploits and image uploads",
            "Key learning: Magento security issues but highlights that not all theoretical exploits work in practice"
        ]
    },
    {
        name: "Tabby",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Apache Tomcat", "LFI", "Directory Enumeration"],
        steps: [
            "Initial foothold: Discovered Apache Tomcat 9.0.31 and attempted various enumeration techniques",
            "Privilege escalation: Unable to complete exploitation despite identifying potential attack vectors",
            "Key learning: Not all discovered services lead to successful exploitation without proper credentials"
        ]
    },
    {
        name: "Traverxec",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Nostromo RCE", "SSH Key Cracking", "Journalctl GTFOBins"],
        steps: [
            "Initial foothold: Exploited Nostromo 1.9.6 directory traversal vulnerability for RCE",
            "Privilege escalation: Cracked SSH private key and exploited journalctl in less pager for root shell",
            "Key learning: Web server specific vulnerabilities and terminal manipulation for privilege escalation"
        ]
    },
    {
        name: "Valentine",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Heartbleed", "Memory Disclosure", "SSH Key Extraction"],
        steps: [
            "Initial foothold: Exploited Heartbleed vulnerability to extract private SSH key from memory",
            "Privilege escalation: Found tmux session running as root and attached to gain root access",
            "Key learning: SSL vulnerability exploitation and process enumeration for privilege escalation"
        ]
    },
    {
        name: "Access",
        platform: "pg",
        difficulty: "hard",
        os: "windows",
        techniques: ["Web Exploitation", "Active Directory", "Kerberoasting"],
        steps: [
            "Initial foothold: Reverse shell via file upload",
            "Privilege escalation: Kerberoastable account allowed to login and retrieve flag via SEVolumeManagePrivilege abuse",
            "Key learning: Focus on low-hanging fruit first (e.g., Kerberoasting) when targeting AD"
        ]
    },
    {
        name: "Algernon",
        platform: "pg",
        difficulty: "easy",
        os: "windows",
        techniques: ["Vulnerable Webmail Server", "File Upload", "Reverse Shell"],
        steps: [
            "Initial foothold: Exploited vulnerable CMS to get reverse shell",
            "Privilege escalation: The webmail service running as NT Authority",
            "Key learning: Enumeration is key"
        ]
    },
    {
        name: "Authby",
        platform: "pg",
        difficulty: "easy",
        os: "windows",
        techniques: ["Web Enumeration", "Hash Cracking", "Privilege Abuse"],
        steps: [
            "Initial foothold: Found exposed hash. Used it to login to FTP server to upload webshell",
            "Privilege escalation: Abused SEImpersonatePrivilege to get shell as NT Authority",
            "Key learning: Always check for exposed credentials and Windows privilege escalation techniques"
        ]
    },
    {
        name: "Apex",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["Directory Traversal", "OpenEMR RCE", "Password Reuse"],
        steps: [
            "Initial foothold: Exploited directory traversal in Responsive File Manager to extract OpenEMR database credentials",
            "Privilege escalation: Reused cracked admin password for root access after gaining shell via authenticated OpenEMR RCE",
            "Key learning: Focus on one web endpoint at a time and leverage credential reuse across services"
        ]
    },
    {
        name: "Astronaut",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["Grav CMS", "RCE", "SUID Binary"],
        steps: [
            "Initial foothold: Exploited Grav CMS vulnerability to gain remote code execution",
            "Privilege escalation: Exploited SUID binary for root access",
            "Key learning: CMS vulnerabilities can provide direct system access when properly exploited"
        ]
    },
    {
        name: "Bitforge",
        platform: "pg",
        difficulty: "medium",
        os: "linux",
        techniques: ["Web Application", "Command Injection", "Privilege Escalation"],
        steps: [
            "Initial foothold: Discovered command injection vulnerability in web application",
            "Privilege escalation: Exploited system misconfiguration to gain root privileges",
            "Key learning: Web application input validation flaws can lead to complete system compromise"
        ]
    },
    {
        name: "Bratarina",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["SMTP Enumeration", "OpenSSH", "Weak Credentials"],
        steps: [
            "Initial foothold: Enumerated SMTP service and found weak SSH credentials",
            "Privilege escalation: Leveraged sudo privileges to gain root access",
            "Key learning: Thorough service enumeration often reveals credential-based attack vectors"
        ]
    },
    {
        name: "Bullybox",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["Web Enumeration", "File Upload", "Privilege Escalation"],
        steps: [
            "Initial foothold: Exploited file upload vulnerability in web application",
            "Privilege escalation: Found and exploited system misconfiguration for root access",
            "Key learning: File upload vulnerabilities remain a common and effective attack vector"
        ]
    },
    {
        name: "Clamav",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["Sendmail", "Mail Transfer Agent", "Local Privilege Escalation"],
        steps: [
            "Initial foothold: Exploited Sendmail vulnerability to gain initial access",
            "Privilege escalation: Found and exploited local privilege escalation vulnerability",
            "Key learning: Mail services often contain vulnerabilities that lead to system compromise"
        ]
    },
    {
        name: "Cockpit",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["Cockpit Service", "Weak Authentication", "System Access"],
        steps: [
            "Initial foothold: Gained access through Cockpit web interface with weak credentials",
            "Privilege escalation: Already had elevated privileges through Cockpit interface",
            "Key learning: Web-based system administration tools can provide direct high-privilege access"
        ]
    },
    {
        name: "Exfiltrated",
        platform: "pg",
        difficulty: "medium",
        os: "linux",
        techniques: ["Web Application", "SQL Injection", "File Disclosure"],
        steps: [
            "Initial foothold: Exploited SQL injection vulnerability to extract sensitive information",
            "Privilege escalation: Used disclosed credentials to gain system access and escalate privileges",
            "Key learning: SQL injection can lead to complete data exfiltration and system compromise"
        ]
    },
    {
        name: "Extplorer",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["eXtplorer", "File Manager", "RCE"],
        steps: [
            "Initial foothold: Exploited eXtplorer file manager vulnerability for remote code execution",
            "Privilege escalation: Found system misconfiguration allowing privilege escalation",
            "Key learning: Web-based file managers often contain vulnerabilities leading to code execution"
        ]
    },
    {
        name: "Fantastic",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["Web Application", "Directory Traversal", "Configuration Files"],
        steps: [
            "Initial foothold: Used directory traversal to access sensitive configuration files",
            "Privilege escalation: Leveraged exposed credentials for privilege escalation",
            "Key learning: Directory traversal vulnerabilities can expose critical system information"
        ]
    },
    {
        name: "Fired",
        platform: "pg",
        difficulty: "medium",
        os: "linux",
        techniques: ["Web Enumeration", "Exploitation", "System Misconfiguration"],
        steps: [
            "Initial foothold: Discovered and exploited web application vulnerability",
            "Privilege escalation: Exploited system misconfiguration to gain root access",
            "Key learning: Comprehensive enumeration reveals multiple attack vectors"
        ]
    },
    {
        name: "Flu",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["Web Application", "SQLi", "File Inclusion"],
        steps: [
            "Initial foothold: Exploited SQL injection to gain initial access",
            "Privilege escalation: Used file inclusion vulnerability to escalate privileges",
            "Key learning: Multiple web vulnerabilities can be chained for complete compromise"
        ]
    },
    {
        name: "Hawat",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["Web Enumeration", "Python Script", "Privilege Escalation"],
        steps: [
            "Initial foothold: Found and exploited vulnerable Python script in web application",
            "Privilege escalation: Leveraged script execution context for privilege escalation",
            "Key learning: Custom scripts often contain vulnerabilities not found in standard applications"
        ]
    },
    {
        name: "Hetemit",
        platform: "pg",
        difficulty: "medium",
        os: "linux",
        techniques: ["Web Application", "Hash Cracking", "System Exploitation"],
        steps: [
            "Initial foothold: Extracted and cracked password hashes from web application",
            "Privilege escalation: Used cracked credentials to gain system access and escalate privileges",
            "Key learning: Password hash extraction and cracking remain effective attack methods"
        ]
    },
    {
        name: "Levram",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["Web Application", "Command Injection", "SUID Exploitation"],
        steps: [
            "Initial foothold: Exploited command injection vulnerability in web application",
            "Privilege escalation: Found and exploited SUID binary for root access",
            "Key learning: Command injection combined with SUID exploitation provides reliable privilege escalation"
        ]
    },
    {
        name: "Wombo",
        platform: "pg",
        difficulty: "easy",
        os: "linux",
        techniques: ["Redis", "Unauthenticated Access", "SSH Key Upload"],
        steps: [
            "Initial foothold: Exploited unauthenticated Redis instance to upload SSH public key",
            "Privilege escalation: Used Redis access to escalate privileges through system misconfigurations",
            "Key learning: Unauthenticated Redis instances provide multiple paths to system compromise"
        ]
    },
    {
        name: "Hokkaido",
        platform: "pg",
        difficulty: "medium",
        os: "windows",
        techniques: ["Web Application", "File Upload", "Windows Privilege Escalation"],
        steps: [
            "Initial foothold: Exploited file upload vulnerability to gain initial system access",
            "Privilege escalation: Used Windows privilege escalation techniques to gain administrator access",
            "Key learning: File upload vulnerabilities on Windows systems often lead to complete compromise"
        ]
    },
    {
        name: "Hutch",
        platform: "pg",
        difficulty: "medium",
        os: "windows",
        techniques: ["Active Directory", "Kerberos", "Privilege Escalation"],
        steps: [
            "Initial foothold: Exploited Kerberos authentication weakness to gain domain access",
            "Privilege escalation: Used Active Directory misconfigurations for privilege escalation",
            "Key learning: Active Directory environments provide multiple privilege escalation paths"
        ]
    },
    {
        name: "Internal",
        platform: "pg",
        difficulty: "medium",
        os: "windows",
        techniques: ["SMB Enumeration", "Credential Harvesting", "Lateral Movement"],
        steps: [
            "Initial foothold: Enumerated SMB shares to discover and harvest credentials",
            "Privilege escalation: Used harvested credentials for lateral movement and privilege escalation",
            "Key learning: SMB enumeration often reveals credentials enabling further compromise"
        ]
    },
    {
        name: "Kevin",
        platform: "pg",
        difficulty: "easy",
        os: "windows",
        techniques: ["Web Application", "Credential Exposure", "Windows Services"],
        steps: [
            "Initial foothold: Found exposed credentials in web application configuration",
            "Privilege escalation: Leveraged service account privileges for system access",
            "Key learning: Configuration files often contain credentials enabling system compromise"
        ]
    },
    {
        name: "Mice",
        platform: "pg",
        difficulty: "medium",
        os: "windows",
        techniques: ["JuiceShop", "Web Exploitation", "Windows Escalation"],
        steps: [
            "Initial foothold: Exploited JuiceShop application vulnerabilities to gain access",
            "Privilege escalation: Used Windows-specific privilege escalation techniques",
            "Key learning: Known vulnerable applications provide reliable practice for exploitation techniques"
        ]
    },
    {
        name: "Monster",
        platform: "pg",
        difficulty: "hard",
        os: "windows",
        techniques: ["Complex Exploitation", "Multi-Stage Attack", "Advanced Persistence"],
        steps: [
            "Initial foothold: Executed complex multi-stage attack to gain initial system access",
            "Privilege escalation: Used advanced Windows techniques for privilege escalation and persistence",
            "Key learning: Complex targets require methodical approach and multiple exploitation techniques"
        ]
    },
    {
        name: "Squid",
        platform: "pg",
        difficulty: "medium",
        os: "windows",
        techniques: ["Proxy Services", "Network Pivoting", "Credential Harvesting"],
        steps: [
            "Initial foothold: Exploited Squid proxy service to gain network access",
            "Privilege escalation: Used network pivoting and credential harvesting for privilege escalation",
            "Key learning: Proxy services can provide network access and pivoting opportunities"
        ]
    }
];

function initializeLabs() {
    renderBoxes(boxesData);
    initializeFilters();
    initializeModal();
    updateLabsStats();
}

function renderBoxes(boxes) {
    const grid = document.getElementById('boxes-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    boxes.forEach((box, index) => {
        const boxElement = document.createElement('div');
        boxElement.className = `box-card ${box.platform} ${box.difficulty} ${box.os}`;
        boxElement.innerHTML = `
            <div class="box-header">
                <h3 class="box-name">${box.name}</h3>
                <div class="box-badges">
                    <span class="badge platform-badge ${box.platform}">${box.platform.toUpperCase()}</span>
                    <span class="badge difficulty-badge ${box.difficulty}">${box.difficulty.toUpperCase()}</span>
                    <span class="badge os-badge ${box.os}">${box.os}</span>
                </div>
            </div>
            <div class="box-techniques">
                ${box.techniques.slice(0, 3).map(tech => `<span class="technique-tag">${tech}</span>`).join('')}
            </div>
            <div class="box-footer">
                <button class="view-writeup-btn" data-box="${box.name}">VIEW WRITEUP</button>
            </div>
        `;
        
        // Set initial styles for animation
        boxElement.style.opacity = '1';
        boxElement.style.transform = 'translateY(0)';
        
        grid.appendChild(boxElement);
        
        // Add staggered entrance animation
        setTimeout(() => {
            boxElement.style.transition = 'all 0.3s ease';
        }, index * 100);
    });
    
    // Add click handlers for writeup buttons
    document.querySelectorAll('.view-writeup-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const boxName = this.getAttribute('data-box');
            const box = boxesData.find(b => b.name === boxName);
            if (box) {
                showModal(box);
            }
        });
    });
}

function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            filterBoxes(filter);
        });
    });
}

function filterBoxes(filter) {
    const boxes = document.querySelectorAll('.box-card');
    
    boxes.forEach(box => {
        const shouldShow = filter === 'all' || box.classList.contains(filter);
        
        if (shouldShow) {
            box.style.display = 'block';
            box.style.opacity = '0';
            setTimeout(() => {
                box.style.opacity = '1';
                box.style.transform = 'translateY(0)';
            }, 100);
        } else {
            box.style.opacity = '0';
            box.style.transform = 'translateY(20px)';
            setTimeout(() => {
                box.style.display = 'none';
            }, 300);
        }
    });
}

function initializeModal() {
    const modal = document.getElementById('box-modal');
    const closeBtn = document.querySelector('.modal-close');
    
    closeBtn.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

function showModal(box) {
    const modal = document.getElementById('box-modal');
    
    document.getElementById('modal-title').textContent = box.name;
    document.getElementById('modal-platform').textContent = box.platform.toUpperCase();
    document.getElementById('modal-platform').className = `badge platform-badge ${box.platform}`;
    document.getElementById('modal-difficulty').textContent = box.difficulty.toUpperCase();
    document.getElementById('modal-difficulty').className = `badge difficulty-badge ${box.difficulty}`;
    document.getElementById('modal-os').textContent = box.os;
    document.getElementById('modal-os').className = `badge os-badge ${box.os}`;
    
    // Techniques
    const techniquesContainer = document.getElementById('modal-techniques');
    techniquesContainer.innerHTML = box.techniques.map(tech => 
        `<span class="technique-tag">${tech}</span>`
    ).join('');
    
    // Steps
    const stepsList = document.getElementById('modal-steps');
    stepsList.innerHTML = box.steps.map(step => `<li>${step}</li>`).join('');
    
    modal.classList.add('active');
}

function updateLabsStats() {
    const totalBoxes = boxesData.length;
    const platforms = [...new Set(boxesData.map(box => box.platform))].length;
    const techniques = [...new Set(boxesData.flatMap(box => box.techniques))].length;
    
    document.getElementById('total-boxes').textContent = totalBoxes;
    document.getElementById('platforms').textContent = platforms;
    document.getElementById('techniques').textContent = techniques + '+';
}

