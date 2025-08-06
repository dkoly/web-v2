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
        name: "Admirer",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Web Enumeration", "FTP Anonymous"],
        steps: [
            "Initial foothold: FTP anonymous access revealed credentials and web files",
            "Privilege escalation: Exposed local user credentials",
            "Key learning: Always check if credentials are reused across different services (e.g., DB, SSH)"
        ]
    },
    {
        name: "Beep",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Web Application", "LFI", "Privilege Escalation"],
        steps: [
            "Initial foothold: Local File Inclusion in web application",
            "Privilege escalation: Sudo privileges or kernel exploit",
            "Key learning: LFI can lead to credential disclosure and system access"
        ]
    },
    {
        name: "Blocky",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Web Enumeration", "JAR Analysis", "SSH Credentials"],
        steps: [
            "Initial foothold: JAR file analysis revealed database credentials",
            "Privilege escalation: Password reuse for SSH and sudo access",
            "Key learning: Developers often reuse passwords across services"
        ]
    },
    {
        name: "Blunder",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["Bludit CMS", "Brute Force", "Sudo CVE"],
        steps: [
            "Initial foothold: Bludit CMS brute force bypass and RCE",
            "Privilege escalation: Sudo vulnerability (CVE-2019-14287)",
            "Key learning: Always check sudo version for known CVEs"
        ]
    },
    {
        name: "Doctor",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["SSTI", "Log Poisoning", "Splunk Universal Forwarder"],
        steps: [
            "Initial foothold: Server-Side Template Injection in web application",
            "Privilege escalation: Splunk Universal Forwarder exploitation",
            "Key learning: SSTI can provide direct code execution capabilities"
        ]
    },
    {
        name: "FriendZone",
        platform: "htb",
        difficulty: "easy",
        os: "linux",
        techniques: ["DNS Zone Transfer", "SMB Enumeration", "LFI"],
        steps: [
            "Initial foothold: DNS zone transfer revealed subdomains and SMB shares",
            "Privilege escalation: Web shell upload via SMB and execution via LFI",
            "Key learning: DNS zone transfers can reveal hidden attack surface"
        ]
    },
    {
        name: "Frolic",
        platform: "htb",
        difficulty: "medium",
        os: "linux",
        techniques: ["Web Enumeration", "Buffer Overflow", "Binary Exploitation"],
        steps: [
            "Initial foothold: Web directory traversal and password cracking",
            "Privilege escalation: Buffer overflow in custom binary",
            "Key learning: Simple buffer overflows still exist in custom applications"
        ]
    },
    {
        name: "Access",
        platform: "pg",
        difficulty: "hard",
        os: "windows",
        techniques: ["Web Exploitation", "Active Directory", "Kerberoasting"],
        steps: [
            "Initial foothold: Reverse shell via file upload.",
            "Privilege escalation: Kerberoastable account allowed to login and retrieve flag via SEVolumeManagePrivilege abuse",
            "Key learning: Focus on low-hanging fruit first (e.g., Kerberosating) when targeting AD",
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
            "Initial foothold: Found exposed hash. Used it to login to FTP server to upload webshell.",
            "Privilege escalation: Abused SEImpersonatePrivilege to get shell as NT Authority",
        ]
    },

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

