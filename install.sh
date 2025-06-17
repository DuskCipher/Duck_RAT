
#!/bin/bash

# ======== COLOR PALETTE ============== 
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
UNDERLINE='\033[4m'
BLINK='\033[5m'
NC='\033[0m' # No Color

# Special colors for enhanced UI
ORANGE='\033[0;33m'
LIGHT_BLUE='\033[1;34m'
LIGHT_GREEN='\033[1;32m'
LIGHT_RED='\033[1;31m'
GRAY='\033[0;37m'

#============== ENHANCED ANIMATION ==============
animate_text() {
    local text="$1"
    local color="$2"
    local speed="${3:-0.03}"
    echo -n -e "${color}"
    for (( i=0; i<${#text}; i++ )); do
        echo -n "${text:$i:1}"
        sleep "$speed"
    done
    echo -e "${NC}"
}

typing_effect() {
    local text="$1"
    local color="$2"
    echo -n -e "${color}"
    for (( i=0; i<${#text}; i++ )); do
        echo -n "${text:$i:1}"
        sleep 0.02
    done
    echo -e "${NC}"
}

#============== ENHANCED PRINT FUNCTIONS ==============
print_colored() {
    echo -e "${1}${2}${NC}"
}

print_status() {
    local status="$1"
    local message="$2"
    case "$status" in
        "success") echo -e "${GREEN}✅ ${message}${NC}" ;;
        "error") echo -e "${RED}❌ ${message}${NC}" ;;
        "warning") echo -e "${YELLOW}⚠️  ${message}${NC}" ;;
        "info") echo -e "${BLUE}ℹ️  ${message}${NC}" ;;
        "loading") echo -e "${CYAN}🔄 ${message}${NC}" ;;
    esac
}

#============== ENHANCED BORDER FUNCTIONS ==============
print_box() {
    local text="$1"
    local color="$2"
    local width="${3:-60}"
    local border_char="="

    echo -e "${color}"
    printf "╔"
    printf "%*s" $((width - 2)) | tr ' ' "$border_char"
    printf "╗\n"
    
    local text_length=${#text}
    local padding=$(( (width - text_length - 4) / 2 ))
    printf "║"
    printf "%*s" $padding
    printf " %s " "$text"
    printf "%*s" $((width - text_length - padding - 4))
    printf "║\n"
    
    printf "╚"
    printf "%*s" $((width - 2)) | tr ' ' "$border_char"
    printf "╝\n"
    echo -e "${NC}"
}

print_section_header() {
    local title="$1"
    local color="$2"
    local width=70
    
    echo
    echo -e "${color}"
    printf "┌"
    printf "%*s" $((width - 2)) | tr ' ' "─"
    printf "┐\n"
    
    local title_length=${#title}
    local padding=$(( (width - title_length - 4) / 2 ))
    printf "│"
    printf "%*s" $padding
    printf " %s " "$title"
    printf "%*s" $((width - title_length - padding - 4))
    printf "│\n"
    
    printf "└"
    printf "%*s" $((width - 2)) | tr ' ' "─"
    printf "┘\n"
    echo -e "${NC}"
}

print_progress_bar() {
    local current="$1"
    local total="$2"
    local width=50
    local percentage=$((current * 100 / total))
    local filled=$((current * width / total))
    
    printf "\r${CYAN}["
    printf "%*s" $filled | tr ' ' '█'
    printf "%*s" $((width - filled)) | tr ' ' '░'
    printf "] %d%% (%d/%d)${NC}" $percentage $current $total
}

#============== SYSTEM CHECK FUNCTIONS ==============
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

get_distro() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        echo "$NAME"
    else
        echo "Unknown Linux"
    fi
}

#============== ENHANCED SYSTEM INFO ==============
check_internet_and_info() {
    local os=$(detect_os)
    local distro=""
    local node_version=""
    local npm_version=""
    local internet_status=""
    local cpu_info=""
    local memory_info=""

    # Get system info
    if [[ "$os" == "linux" ]]; then
        distro=$(get_distro)
        cpu_info=$(nproc 2>/dev/null || echo "N/A")
        memory_info=$(free -h 2>/dev/null | awk '/^Mem:/ {print $2}' || echo "N/A")
    fi

    # Check internet with multiple servers
    print_status "loading" "Checking internet connectivity..."
    if ping -c 1 google.com &> /dev/null || ping -c 1 1.1.1.1 &> /dev/null; then
        internet_status="${GREEN}🟢 Online${NC}"
    else
        internet_status="${RED}🔴 Offline${NC}"
    fi

    # Get versions
    if command_exists node; then
        node_version=$(node --version)
    else
        node_version="${RED}Not installed${NC}"
    fi

    if command_exists npm; then
        npm_version=$(npm --version)
    else
        npm_version="${RED}Not installed${NC}"
    fi

    # Enhanced system info display
    echo
    print_section_header "SYSTEM INFORMATION" "$BOLD$BLUE"
    
    echo -e "${BLUE}┌─ Network & Environment ──────────────────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│${NC} 🌐 Internet: $internet_status   🖥️  OS: ${CYAN}$os${NC}   📊 Distro: ${CYAN}$distro${NC}                   ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC} 🟢 Node.js: ${CYAN}$node_version${NC}   📦 NPM: ${CYAN}$npm_version${NC}   🔧 CPU Cores: ${CYAN}$cpu_info${NC}                      ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC} 💾 Memory: ${CYAN}$memory_info${NC}   📅 Date: ${CYAN}$(date '+%Y-%m-%d %H:%M:%S')${NC}                               ${BLUE}│${NC}"
    echo -e "${BLUE}└──────────────────────────────────────────────────────────────────────────────┘${NC}"
    
    # Warning if offline
    if ! ping -c 1 google.com &> /dev/null; then
        echo
        print_status "warning" "Offline mode detected - Some features may not work properly"
    fi
    echo
}

#============== ENHANCED BANNER ==============
display_banner_logut() {
    clear

    # DuckHat specific banner
    echo -e "${BOLD}${CYAN}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                               ║
    ║        ██████╗ ██╗   ██╗ ██████╗██╗  ██╗██╗  ██╗ █████╗ ████████╗             ║
    ║        ██╔══██╗██║   ██║██╔════╝██║ ██╔╝██║  ██║██╔══██╗╚══██╔══╝             ║
    ║        ██║  ██║██║   ██║██║     █████╔╝ ███████║███████║   ██║                ║
    ║        ██║  ██║██║   ██║██║     ██╔═██╗ ██╔══██║██╔══██║   ██║                ║
    ║        ██████╔╝╚██████╔╝╚██████╗██║  ██╗██║  ██║██║  ██║   ██║                ║
    ║        ╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝                ║
    ║                                                                               ║
    ║                      🚀 ADVANCED INSTALLER v3.8 🚀                            ║
    ║                                                                               ║
    ║                     ┌─────────────────────────────────────┐                   ║
    ║                     │  💎 Professional RAT Panel Setup    │                   ║
    ║                     │  🔧 Automated Configuration Tool    │                   ║
    ║                     │  ⚡ Enhanced Performance & UI       │                   ║
    ║                     └─────────────────────────────────────┘                   ║
    ║                                                                               ║
    ║                        Crafted with ❤️  by @izal_buyx                          ║
    ║                              DuskCipher Team                                  ║
    ║                                                                               ║
    ╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

#============== ENHANCED BANNER ==============
display_banner() {
    clear
    
    # DuckHat specific banner
    echo -e "${BOLD}${CYAN}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                               ║
    ║        ██████╗ ██╗   ██╗ ██████╗██╗  ██╗██╗  ██╗ █████╗ ████████╗             ║
    ║        ██╔══██╗██║   ██║██╔════╝██║ ██╔╝██║  ██║██╔══██╗╚══██╔══╝             ║
    ║        ██║  ██║██║   ██║██║     █████╔╝ ███████║███████║   ██║                ║
    ║        ██║  ██║██║   ██║██║     ██╔═██╗ ██╔══██║██╔══██║   ██║                ║
    ║        ██████╔╝╚██████╔╝╚██████╗██║  ██╗██║  ██║██║  ██║   ██║                ║
    ║        ╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝                ║
    ║                                                                               ║
    ║                      🚀 ADVANCED INSTALLER v3.8 🚀                            ║
    ║                                                                               ║
    ║                     ┌─────────────────────────────────────┐                   ║
    ║                     │  💎 Professional RAT Panel Setup    │                   ║
    ║                     │  🔧 Automated Configuration Tool    │                   ║
    ║                     │  ⚡ Enhanced Performance & UI       │                   ║
    ║                     └─────────────────────────────────────┘                   ║
    ║                                                                               ║
    ║                        Crafted with ❤️  by @izal_buyx                          ║
    ║                              DuskCipher Team                                  ║
    ║                                                                               ║
    ╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    # Animated welcome message
    echo
    typing_effect "🔥 Welcome to DuckHat RAT Panel - Advanced Installer!" "$BOLD$GREEN"
    typing_effect "✨ Preparing your environment for optimal performance..." "$LIGHT_BLUE"
    echo
    
    # Loading animation
    echo -n -e "${CYAN}🔄 Initializing system checks"
    for i in {1..10}; do
        echo -n "."
        sleep 0.1
    done
    echo -e " Complete!${NC}"
    sleep 1
}

display_duckhat_banner() {
    clear
    
    # Enhanced DuckHat ASCII banner
    echo -e "${BOLD}${CYAN}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                               ║
    ║        ██████╗ ██╗   ██╗ ██████╗██╗  ██╗██╗  ██╗ █████╗ ████████╗             ║
    ║        ██╔══██╗██║   ██║██╔════╝██║ ██╔╝██║  ██║██╔══██╗╚══██╔══╝             ║
    ║        ██║  ██║██║   ██║██║     █████╔╝ ███████║███████║   ██║                ║
    ║        ██║  ██║██║   ██║██║     ██╔═██╗ ██╔══██║██╔══██║   ██║                ║
    ║        ██████╔╝╚██████╔╝╚██████╗██║  ██╗██║  ██║██║  ██║   ██║                ║
    ║        ╚═════╝  ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝                ║
    ║                                                                               ║
    ║                      🚀 ADVANCED INSTALLER v3.8 🚀                            ║
    ║                                                                               ║
    ║                     ┌─────────────────────────────────────┐                   ║
    ║                     │  💎 Professional RAT Panel Setup    │                   ║
    ║                     │  🔧 Automated Configuration Tool    │                   ║
    ║                     │  ⚡ Enhanced Performance & UI       │                   ║
    ║                     └─────────────────────────────────────┘                   ║
    ║                                                                               ║
    ║                        Crafted with ❤️  by @izal_buyx                          ║
    ║                              DuskCipher Team                                  ║
    ║                                                                               ║
    ╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    # Animated loading
    echo
    typing_effect "🎯 DuckHat RAT Panel Initializing..." "$BOLD$GREEN"
    typing_effect "🔧 Setting up advanced remote access tools..." "$LIGHT_BLUE"
    echo
    
    # Progress indicator
    echo -n -e "${CYAN}🔄 Loading DuckHat modules"
    for i in {1..8}; do
        echo -n "."
        sleep 0.15
    done
    echo -e " Ready!${NC}"
    sleep 1
}

#============== ENHANCED NODE.JS INSTALLATION ==============
install_nodejs() {
    local os=$(detect_os)

    print_section_header "NODE.JS INSTALLATION" "$BOLD$YELLOW"

    case $os in
        "linux")
            print_status "info" "Detecting Linux distribution..."
            local distro=$(get_distro)
            print_status "info" "Distribution: $distro"
            
            if command_exists apt-get; then
                print_status "loading" "Installing Node.js via APT..."
                {
                    sudo apt-get update -qq
                    sudo apt-get install -y nodejs npm
                } &
                local pid=$!
                
                # Progress animation
                local i=0
                while kill -0 $pid 2>/dev/null; do
                    print_progress_bar $((i % 20 + 1)) 20
                    sleep 0.5
                    ((i++))
                done
                wait $pid
                echo
                
            elif command_exists yum; then
                print_status "loading" "Installing Node.js via YUM..."
                sudo yum install -y nodejs npm
                
            elif command_exists pacman; then
                print_status "loading" "Installing Node.js via Pacman..."
                sudo pacman -S nodejs npm
                
            else
                print_status "error" "Package manager not recognized. Please install Node.js manually."
                return 1
            fi
            ;;
            
        "macos")
            print_status "info" "macOS detected - Installing Node.js..."
            if command_exists brew; then
                print_status "loading" "Installing via Homebrew..."
                brew install node
            else
                print_status "warning" "Homebrew not found. Installing Homebrew first..."
                /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
                brew install node
            fi
            ;;
            
        "windows")
            print_status "info" "Windows detected"
            print_colored $CYAN "📥 Please download Node.js from: https://nodejs.org/en/download/"
            print_status "warning" "Restart terminal after installation completes"
            return 1
            ;;
            
        *)
            print_status "error" "Unknown OS. Please install Node.js manually."
            return 1
            ;;
    esac

    # Enhanced verification
    echo
    print_status "loading" "Verifying Node.js installation..."
    sleep 1
    
    if command_exists node && command_exists npm; then
        print_status "success" "Node.js successfully installed!"
        echo -e "${GREEN}┌─ Installation Details ────────────────────────────────────┐${NC}"
        echo -e "${GREEN}│${NC} 🟢 Node.js version: ${CYAN}$(node --version)${NC} ${GREEN}│${NC}"
        echo -e "${GREEN}│${NC} 📦 NPM version: ${CYAN}$(npm --version)${NC} ${GREEN}│${NC}"
        echo -e "${GREEN}│${NC} 📁 Install path: ${CYAN}$(which node)${NC} ${GREEN}│${NC}"
        echo -e "${GREEN}└──────────────────────────────────────────────────────────┘${NC}"
        return 0
    else
        print_status "error" "Node.js installation failed!"
        return 1
    fi
}

#============== ENHANCED PROJECT STRUCTURE ==============
create_project_structure() {
    print_section_header "PROJECT STRUCTURE SETUP" "$BOLD$PURPLE"

    local directories=("uploadedFile" "logs" "temp" "public" "config" "assets")
    local total=${#directories[@]}
    local current=0

    echo -e "${PURPLE}┌─ Creating Directory Structure ────────────────────────────────────────────┐${NC}"

    for dir in "${directories[@]}"; do
        ((current++))
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            print_status "success" "Created directory: ${CYAN}$dir${NC}"
        else
            print_status "warning" "Directory exists: ${YELLOW}$dir${NC}"
        fi
        print_progress_bar $current $total
        sleep 0.3
    done

    echo
    echo -e "${PURPLE}└──────────────────────────────────────────────────────────────────────────┘${NC}"

    # Enhanced .gitignore
    print_status "loading" "Creating enhanced .gitignore..."
    if [[ ! -f ".gitignore" ]]; then
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
logs/
*.log
pids
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/
.nyc_output

# Compiled binary addons
build/Release

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Uploaded files
uploadedFile/*
!uploadedFile/.gitkeep

# Temporary files
temp/*
!temp/.gitkeep

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Configuration files
config/local.js
config/production.js

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# Backup files
*.backup
*.bak
EOF
        print_status "success" "Enhanced .gitignore created"
    fi

    # Create placeholder files with info
    for dir in uploadedFile logs temp; do
        cat > "$dir/.gitkeep" << EOF
# This file keeps the directory in git
# Directory: $dir
# Purpose: $(case $dir in
    uploadedFile) echo "Store uploaded files from connected devices" ;;
    logs) echo "Application and system logs" ;;
    temp) echo "Temporary files and cache" ;;
esac)
# Created: $(date)
EOF
    done

    print_status "success" "Project structure completed successfully!"
}

#============== ENHANCED DEPENDENCY INSTALLATION ==============
install_dependencies() {
    print_section_header "DEPENDENCY INSTALLATION" "$BOLD$GREEN"

    if [[ ! -f "package.json" ]]; then
        print_status "warning" "package.json not found! Creating enhanced version..."

        cat > package.json << 'EOF'
{
  "name": "duckhat-rat-panel",
  "version": "2.0.0",
  "description": "Advanced DuckHat RAT Control Panel with Enhanced Features",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "echo \"Build process completed\"",  
    "clean": "rm -rf node_modules package-lock.json",
    "setup": "npm install && node setup.js"
  },
  "author": {
    "name": "@izal_buyx - DuskCipher",
    "email": "support@duskcipher.com",
    "url": "https://github.com/DuskCipher"
  },
  "license": "MIT",
  "keywords": [
    "rat",
    "remote-access",
    "control-panel",
    "telegram-bot",
    "android",
    "security",
    "duckhat"
  ],
  "dependencies": {
    "express": "^4.18.2",
    "ws": "^8.14.2",
    "node-telegram-bot-api": "^0.64.0",
    "uuid": "^9.0.1",
    "multer": "^1.4.5-lts.1",
    "body-parser": "^1.20.2",
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "compression": "^1.7.4",
    "express-rate-limit": "^7.1.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  },
  "engines": {
    "node": ">=14.0.0",
    "npm": ">=6.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/DuskCipher/DuckRat"
  }
}
EOF
        print_status "success" "Enhanced package.json created!"
    fi

    print_status "loading" "Installing dependencies..."
    echo -e "${GREEN}┌─ Package Installation Progress ───────────────────────────────────────────┐${NC}"

    # Enhanced npm install with progress
    {
        npm install --progress=true > /tmp/npm_install.log 2>&1 &
        local npm_pid=$!
        local spinner=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
        local i=0
        local elapsed=0

        while kill -0 $npm_pid 2>/dev/null; do
            printf "\r${GREEN}│${NC} ${spinner[$i]} Installing packages... ${CYAN}%02d:%02d${NC} elapsed ${GREEN}│${NC}" $((elapsed/60)) $((elapsed%60))
            i=$(( (i+1) % ${#spinner[@]} ))
            sleep 1
            ((elapsed++))
        done

        wait $npm_pid
        local exit_code=$?
        printf "\r${GREEN}│${NC} ✅ Installation completed in ${CYAN}%02d:%02d${NC}                                        ${GREEN}│${NC}\n" $((elapsed/60)) $((elapsed%60))
        echo -e "${GREEN}└───────────────────────────────────────────────────────────────────────────┘${NC}"
        
        return $exit_code
    }

    if [[ $? -eq 0 ]]; then
        print_status "success" "Dependencies installed successfully!"
        
        # Show installed packages with enhanced formatting
        echo
        print_status "info" "Installed packages summary:"
        echo -e "${CYAN}┌─ Package List ──────────────────────────────────────┐${NC}"
        npm list --depth=0 --silent 2>/dev/null | grep -E "├──|└──" | head -10 | while read line; do
            echo -e "${CYAN}│${NC} ${WHITE}$line${NC}           ${CYAN}│${NC}"
        done
        echo -e "${CYAN}└─────────────────────────────────────────────────────┘${NC}"
        
        # Show package sizes
        local node_modules_size=$(du -sh node_modules 2>/dev/null | cut -f1)
        print_status "info" "Total installation size: ${CYAN}$node_modules_size${NC}"
        
    else
        print_status "error" "Dependency installation failed!"
        print_status "info" "Check /tmp/npm_install.log for details"
        return 1
    fi
}

#============== ENHANCED VERIFICATION ==============
verify_installation() {
    print_section_header "INSTALLATION VERIFICATION" "$BOLD$CYAN"

    local required_files=("index.js" "package.json" "web-control.html" "start.sh")
    local optional_files=("config.example.js" "README.md" "LICENSE.txt")
    local missing_files=()
    local total_files=$((${#required_files[@]} + ${#optional_files[@]}))
    local current=0

    echo -e "${CYAN}┌─ File Verification ────────────────────────────────────────────────────────┐${NC}"

    # Check required files
    for file in "${required_files[@]}"; do
        ((current++))
        if [[ -f "$file" ]]; then
            local size=$(ls -lh "$file" | awk '{print $5}')
            echo -e "${CYAN}│${NC} ✅ ${WHITE}$file${NC} ${GRAY}($size)${NC}"
        else
            echo -e "${CYAN}│${NC} ❌ ${RED}$file${NC} ${GRAY}(missing - required)${NC}"
            missing_files+=("$file")
        fi
        print_progress_bar $current $total_files
        sleep 0.2
    done

    # Check optional files
    for file in "${optional_files[@]}"; do
        ((current++))
        if [[ -f "$file" ]]; then
            local size=$(ls -lh "$file" | awk '{print $5}')
            echo -e "${CYAN}│${NC} ✅ ${WHITE}$file${NC} ${GRAY}($size - optional)${NC}"
        else
            echo -e "${CYAN}│${NC} ⚠️  ${YELLOW}$file${NC} ${GRAY}(missing - optional)${NC}"
        fi
        print_progress_bar $current $total_files
        sleep 0.2
    done

    echo
    echo -e "${CYAN}└────────────────────────────────────────────────────────────────────────────┘${NC}"

    # Check Node.js functionality
    print_status "loading" "Testing Node.js functionality..."
    if node -e "console.log('Node.js is working!')" >/dev/null 2>&1; then
        print_status "success" "Node.js runtime test passed"
    else
        print_status "error" "Node.js runtime test failed"
        missing_files+=("Node.js runtime")
    fi

    # Check npm functionality
    if npm --version >/dev/null 2>&1; then
        print_status "success" "NPM functionality verified"
    else
        print_status "error" "NPM functionality test failed"
        missing_files+=("NPM functionality")
    fi

    # Summary
    echo
    if [[ ${#missing_files[@]} -eq 0 ]]; then
        print_status "success" "All verification checks passed!"
        echo -e "${GREEN}┌─ Installation Summary ──────────────────────────────────────────────────────┐${NC}"
        echo -e "${GREEN}│${NC} 🎉 DuckHat RAT Panel is ready to use!                                       ${GREEN}│${NC}"
        echo -e "${GREEN}│${NC} 📦 All dependencies installed successfully                                  ${GREEN}│${NC}"
        echo -e "${GREEN}│${NC} 🔧 Configuration files ready                                                ${GREEN}│${NC}"
        echo -e "${GREEN}│${NC} ⚡ System verification completed                                            ${GREEN}│${NC}"
        echo -e "${GREEN}└─────────────────────────────────────────────────────────────────────────────┘${NC}"
        return 0
    else
        print_status "error" "Verification failed - Missing components:"
        for missing in "${missing_files[@]}"; do
            echo -e "   ${RED}▶ $missing${NC}"
        done
        return 1
    fi
}

#============== ENHANCED FINAL INSTRUCTIONS ==============
show_final_instructions() {
    print_section_header "🎯 INSTALLATION COMPLETED!" "$BOLD$GREEN"

    # Success animation
    echo -e "${GREEN}🎉 ${BLINK}CONGRATULATIONS!${NC} ${GREEN}DuckHat RAT Panel is ready!${NC}"
    echo

    # Quick start guide
    echo -e "${BOLD}${UNDERLINE}📋 QUICK START GUIDE${NC}"
    echo
    echo -e "${WHITE}┌─ Step 1: Start the Server ───────────────────────────────────────────────────┐${NC}"
    echo -e "${WHITE}│${NC} ${LIGHT_GREEN}▶${NC} Run: ${CYAN}bash start.sh${NC}                                                         ${WHITE}│${NC}"
    echo -e "${WHITE}│${NC} ${LIGHT_GREEN}▶${NC} Enter your Telegram Bot Token                                              ${WHITE}│${NC}"
    echo -e "${WHITE}│${NC} ${LIGHT_GREEN}▶${NC} Enter your Telegram Chat ID                                                ${WHITE}│${NC}"
    echo -e "${WHITE}└──────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo
    echo -e "${WHITE}┌─ Step 2: Access Control Panel ───────────────────────────────────────────────┐${NC}"
    echo -e "${WHITE}│${NC} ${LIGHT_BLUE}🌐${NC} Web Control Panel: ${CYAN}http://localhost:5000/web-control${NC}                      ${WHITE}│${NC}"
    echo -e "${WHITE}│${NC} ${LIGHT_BLUE}📁${NC} File Manager: ${CYAN}http://localhost:5000/uploadedFile${NC}                          ${WHITE}│${NC}"
    echo -e "${WHITE}│${NC} ${LIGHT_BLUE}🏠${NC} Homepage: ${CYAN}http://localhost:5000${NC}                                           ${WHITE}│${NC}"
    echo -e "${WHITE}└──────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo

    # Advanced features
    echo -e "${BOLD}${UNDERLINE}⚡ ADVANCED FEATURES${NC}"
    echo
    echo -e "${PURPLE}┌─ Available Commands ──────────────────────────────────────────────────────────┐${NC}"
    echo -e "${PURPLE}│${NC} ${WHITE}npm start${NC}     - Start production server                                       ${PURPLE}│${NC}"
    echo -e "${PURPLE}│${NC} ${WHITE}npm run dev${NC}   - Start development server with auto-reload                     ${PURPLE}│${NC}"
    echo -e "${PURPLE}│${NC} ${WHITE}npm run clean${NC} - Clean installation and reinstall dependencies                 ${PURPLE}│${NC}"
    echo -e "${PURPLE}└───────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo

    # Security warnings
    echo -e "${BOLD}${UNDERLINE}⚠️  IMPORTANT SECURITY NOTES${NC}"
    echo
    echo -e "${YELLOW}┌─ Security Guidelines ─────────────────────────────────────────────────────────┐${NC}"
    echo -e "${YELLOW}│${NC} ${RED}🔒${NC} Keep your Telegram Bot Token secure and private                            ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC} ${RED}🛡️${NC}  Use firewall rules to restrict access to port 5000                         ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC} ${RED}⚖️${NC}  Use this tool responsibly and in compliance with local laws                ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC} ${RED}📝${NC} Keep logs for security auditing purposes                                   ${YELLOW}│${NC}"
    echo -e "${YELLOW}└───────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo

    # Support information
    echo -e "${BOLD}${UNDERLINE}🆘 SUPPORT & RESOURCES${NC}"
    echo
    echo -e "${BLUE}┌─ Get Help ────────────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${BLUE}│${NC} ${WHITE}📖 Documentation:${NC} ${CYAN}https://github.com/DuskCipher/DuckRat${NC}                       ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC} ${WHITE}💬 Telegram Support:${NC} ${CYAN}@izal_buyx${NC}                                               ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC} ${WHITE}🐛 Report Issues:${NC} ${CYAN}GitHub Issues Page${NC}                                          ${BLUE}│${NC}"
    echo -e "${BLUE}│${NC} ${WHITE}⭐ Star the Repo:${NC} ${CYAN}https://github.com/DuskCipher/DuckRat${NC}                       ${BLUE}│${NC}"
    echo -e "${BLUE}└───────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo

    # Footer
    echo -e "${BOLD}${PURPLE}💝 Thank you for using DuckHat RAT Panel!${NC}"
    echo -e "${BOLD}${PURPLE}🌟 Crafted with ${RED}❤️${PURPLE} by @izal_buyx - DuskCipher Team${NC}"
    echo
}

#============== ERROR HANDLING ==============
handle_error() {
    echo
    print_section_header "❌ INSTALLATION ERROR" "$BOLD$RED"
    
    print_status "error" "Installation encountered an error!"
    echo
    echo -e "${YELLOW}┌─ Troubleshooting Steps ───────────────────────────────────────────────────────┐${NC}"
    echo -e "${YELLOW}│${NC} ${WHITE}1.${NC} Check internet connectivity: ${CYAN}ping google.com${NC}                      ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC} ${WHITE}2.${NC} Run with elevated privileges: ${CYAN}sudo bash install.sh${NC}                ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC} ${WHITE}3.${NC} Install Node.js manually: ${CYAN}https://nodejs.org${NC}                     ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC} ${WHITE}4.${NC} Clear npm cache: ${CYAN}npm cache clean --force${NC}                       ${YELLOW}│${NC}"
    echo -e "${YELLOW}│${NC} ${WHITE}5.${NC} Check system requirements and dependencies                             ${YELLOW}│${NC}"
    echo -e "${YELLOW}└───────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo
    print_status "info" "Need help? Contact @izal_buyx on Telegram"
    exit 1
}

cleanup() {
    echo
    print_status "warning" "Installation cancelled by user"
    print_status "info" "Cleaning up temporary files..."
    # Add cleanup logic here if needed
    echo
    print_colored $CYAN "👋 Thank you for trying DuckHat RAT Panel!"
    exit 0
}

# Signal handlers
trap cleanup SIGINT SIGTERM

#============== INSTALLATION MENU ==============
show_installation_menu() {
sleep 4
clear
    print_section_header "🎯 PILIHAN PLATFORM INSTALASI" "$BOLD$CYAN"
    echo -e "${WHITE} ╦ ╔╗╔ ╔═╗ ╔╦╗ ╔═╗ ╦   ╦   ╔═╗ ╔═╗ ╦   ╔╦╗ ╦ ╔═╗ ╔═╗  "
    echo -e "${WHITE} ║ ║║║ ╚═╗  ║  ╠═╣ ║   ║   ╠═╣ ╚═╗ ║    ║  ║ ╠═╝ ║╣"
    echo -e "${WHITE} ╩ ╝╚╝ ╚═╝  ╩  ╩ ╩ ╩═╝ ╩═╝ ╩ ╩ ╚═╝ ╩    ╩  ╩ ╩   ╚═╝ "
    echo  
    echo -e "${CYAN}┌─ Pilih Platform Target ───────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC}                                                                               ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${BOLD}${WHITE}1.${NC} ${GREEN}🐧 Linux Desktop/Server${NC} ${GRAY}(Ubuntu, Debian, CentOS, etc.)${NC}                    ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}     ${WHITE}▶${NC} Instalasi untuk sistem Linux dengan akses root/sudo                     ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}     ${WHITE}▶${NC} Menggunakan package manager sistem (apt/yum/pacman)                     ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                                               ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${BOLD}${WHITE}2.${NC} ${ORANGE}📱 Termux Android${NC} ${GRAY}(Android Terminal Emulator)${NC}                             ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}     ${WHITE}▶${NC} Instalasi khusus untuk Termux di perangkat Android                      ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}     ${WHITE}▶${NC} Menggunakan pkg package manager dan setup khusus                        ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                                               ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${BOLD}${WHITE}3.${NC} ${RED}🔒 Kali Linux${NC} ${GRAY}(Penetration Testing Distribution)${NC}                          ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}     ${WHITE}▶${NC} Instalasi untuk Kali Linux dengan tools khusus                          ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}     ${WHITE}▶${NC} Konfigurasi security tools dan penetration testing                      ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                                               ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}  ${BOLD}${WHITE}4.${NC} ${PURPLE}🔍 Auto Detect${NC} ${GRAY}(Deteksi otomatis platform)${NC}                                ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}     ${WHITE}▶${NC} Sistem akan mendeteksi platform secara otomatis                         ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}                                                                               ${CYAN}│${NC}"
    echo -e "${CYAN}└───────────────────────────────────────────────────────────────────────────────┘${NC}"
    echo
    
    while true; do
        echo -n -e "${BOLD}${WHITE}▶ Pilih instalasi ${CYAN}${WHITE}▶ ${NC}"
        read -r PLATFORM_CHOICE
        
        case $PLATFORM_CHOICE in
            1)
                print_status "info" "Platform dipilih: ${GREEN}Linux Desktop/Server${NC}"
                install_linux_desktop
                break
                ;;
            2)
                print_status "info" "Platform dipilih: ${ORANGE}Termux Android${NC}"
                install_termux_android
                break
                ;;
            3)
                print_status "info" "Platform dipilih: ${RED}Kali Linux${NC}"
                install_kali_linux
                break
                ;;
            4)
                print_status "info" "Platform dipilih: ${PURPLE}Auto Detect${NC}"
                auto_detect_and_install
                break
                ;;
            *)
                print_status "error" "Pilihan tidak valid! Silakan pilih 1-4"
                sleep 0
                show_installation_menu
                ;;
        esac
    done
}

#============== PLATFORM BANNERS ==============
show_linux_banner() {
    clear
    echo -e "${BOLD}${GREEN}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                               ║
    ║    ██╗     ██╗███╗   ██╗██╗   ██╗██╗  ██╗    ██████╗ ███████╗███████╗██╗  ██╗ ║
    ║    ██║     ██║████╗  ██║██║   ██║╚██╗██╔╝    ██╔══██╗██╔════╝██╔════╝██║ ██╔╝ ║
    ║    ██║     ██║██╔██╗ ██║██║   ██║ ╚███╔╝     ██║  ██║█████╗  ███████╗█████╔╝  ║
    ║    ██║     ██║██║╚██╗██║██║   ██║ ██╔██╗     ██║  ██║██╔══╝  ╚════██║██╔═██╗  ║
    ║    ███████╗██║██║ ╚████║╚██████╔╝██╔╝ ██╗    ██████╔╝███████╗███████║██║  ██╗ ║
    ║    ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝    ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝ ║
    ║                                                                               ║
    ║                          🐧 LINUX INSTALLATION 🐧                             ║
    ║                                                                               ║
    ║                   ┌───────────────────────────────────────┐                   ║
    ║                   │  🖥️  Desktop & Server Environment    │                     ║
    ║                   │  📦 Package Manager Integration      │                    ║
    ║                   │  🔧 System-wide Configuration        │                    ║
    ║                   └───────────────────────────────────────┘                   ║
    ║                                                                               ║
    ╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    # Animated loading
    echo
    typing_effect "🎯 DuckHat RAT Panel Initializing..." "$BOLD$GREEN"
    typing_effect "🔧 Setting up advanced remote access tools..." "$LIGHT_BLUE"
    echo
    
    # Progress indicator
    echo -n -e "${CYAN}🔄 Loading DuckHat modules"
    for i in {1..8}; do
        echo -n "."
        sleep 0.15
    done
    echo -e " Ready!${NC}"
    sleep 1
}

show_termux_banner() {
    clear
    echo -e "${BOLD}${ORANGE}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                               ║
    ║          ████████╗███████╗██████╗ ███╗   ███╗██╗   ██╗██╗  ██╗                ║
    ║          ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║   ██║╚██╗██╔╝                ║
    ║             ██║   █████╗  ██████╔╝██╔████╔██║██║   ██║ ╚███╔╝                 ║
    ║             ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║   ██║ ██╔██╗                 ║
    ║             ██║   ███████╗██║  ██║██║ ╚═╝ ██║╚██████╔╝██╔╝ ██╗                ║
    ║             ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝                ║
    ║                                                                               ║
    ║           █████╗ ███╗   ██╗██████╗ ██████╗  ██████╗ ██╗██████╗                ║
    ║          ██╔══██╗████╗  ██║██╔══██╗██╔══██╗██╔═══██╗██║██╔══██╗               ║
    ║          ███████║██╔██╗ ██║██║  ██║██████╔╝██║   ██║██║██║  ██║               ║
    ║          ██╔══██║██║╚██╗██║██║  ██║██╔══██╗██║   ██║██║██║  ██║               ║
    ║          ██║  ██║██║ ╚████║██████╔╝██║  ██║╚██████╔╝██║██████╔╝               ║
    ║          ╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝╚═════╝                ║
    ║                                                                               ║
    ║                         📱 TERMUX INSTALLATION 📱                             ║
    ║                                                                               ║
    ║                   ┌───────────────────────────────────────┐                   ║
    ║                   │  🤖 Android Terminal Environment      │                   ║
    ║                   │  📦 PKG Package Manager               │                   ║
    ║                   │  🔧 Mobile-optimized Setup            │                   ║
    ║                   └───────────────────────────────────────┘                   ║
    ║                                                                               ║
    ╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    # Animated loading
    echo
    typing_effect "🎯 DuckHat RAT Panel Initializing..." "$BOLD$GREEN"
    typing_effect "🔧 Setting up advanced remote access tools..." "$LIGHT_BLUE"
    echo
    
    # Progress indicator
    echo -n -e "${CYAN}🔄 Loading DuckHat modules"
    for i in {1..8}; do
        echo -n "."
        sleep 0.15
    done
    echo -e " Ready!${NC}"
    sleep 1
}

show_kali_banner() {
    clear
    echo -e "${BOLD}${RED}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                               ║
    ║      ██╗  ██╗ █████╗ ██╗     ██╗    ██╗     ██╗███╗   ██╗██╗   ██╗██╗  ██╗    ║
    ║      ██║ ██╔╝██╔══██╗██║     ██║    ██║     ██║████╗  ██║██║   ██║╚██╗██╔╝    ║
    ║      █████╔╝ ███████║██║     ██║    ██║     ██║██╔██╗ ██║██║   ██║ ╚███╔╝     ║
    ║      ██╔═██╗ ██╔══██║██║     ██║    ██║     ██║██║╚██╗██║██║   ██║ ██╔██╗     ║
    ║      ██║  ██╗██║  ██║███████╗██║    ███████╗██║██║ ╚████║╚██████╔╝██╔╝ ██╗    ║
    ║      ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝    ╚══════╝╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝    ║
    ║                                                                               ║
    ║                         🔒 KALI LINUX INSTALLATION 🔒                         ║
    ║                                                                               ║
    ║                   ┌───────────────────────────────────────┐                   ║
    ║                   │  🛡️  Penetration Testing Platform      │                   ║
    ║                   │  ⚔️  Advanced Security Tools           │                   ║
    ║                   │  🔍 Forensics & Exploitation Suite    │                   ║
    ║                   └───────────────────────────────────────┘                   ║
    ║                                                                               ║
    ╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    # Animated loading
    echo
    typing_effect "🎯 DuckHat RAT Panel Initializing..." "$BOLD$GREEN"
    typing_effect "🔧 Setting up advanced remote access tools..." "$LIGHT_BLUE"
    echo
    
    # Progress indicator
    echo -n -e "${CYAN}🔄 Loading DuckHat modules"
    for i in {1..8}; do
        echo -n "."
        sleep 0.15
    done
    echo -e " Ready!${NC}"
    sleep 1
}

show_autodetect_banner() {
    clear
    echo -e "${BOLD}${PURPLE}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════════════════════════════════╗
    ║                                                                               ║
    ║       █████╗ ██╗   ██╗████████╗ ██████╗     ██████╗ ███████╗████████╗         ║
    ║      ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗    ██╔══██╗██╔════╝╚══██╔══╝         ║
    ║      ███████║██║   ██║   ██║   ██║   ██║    ██║  ██║█████╗     ██║            ║
    ║      ██╔══██║██║   ██║   ██║   ██║   ██║    ██║  ██║██╔══╝     ██║            ║
    ║      ██║  ██║╚██████╔╝   ██║   ╚██████╔╝    ██████╔╝███████╗   ██║            ║
    ║      ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝     ╚═════╝ ╚══════╝   ╚═╝            ║
    ║                                                                               ║
    ║                        🔍 AUTO DETECTION MODE 🔍                              ║
    ║                                                                               ║
    ║                   ┌───────────────────────────────────────┐                   ║
    ║                   │  🤖 Intelligent Platform Detection    │                   ║
    ║                   │  🔄 Automatic Configuration           │                   ║
    ║                   │  ⚡ Smart Installation Process        │                   ║
    ║                   └───────────────────────────────────────┘                   ║
    ║                                                                               ║
    ╚═══════════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    sleep 11
}

#============== LINUX DESKTOP/SERVER INSTALLATION ==============
install_linux_desktop() {
    show_linux_banner
    display_duckhat_banner
    
    print_section_header "🐧 INSTALASI LINUX DESKTOP/SERVER" "$BOLD$GREEN"
    
    print_status "info" "Memulai instalasi untuk Linux Desktop/Server..."
    echo
    
    # Enhanced system check for Linux
    check_internet_and_info
    
    # Detect Linux distribution
    local distro=$(get_distro)
    print_status "info" "Distribusi terdeteksi: ${CYAN}$distro${NC}"
    
    # Update system packages
    print_status "loading" "Memperbarui package list sistem..."
    if command_exists apt-get; then
        sudo apt-get update -qq
        print_status "success" "Package list diperbarui (APT)"
    elif command_exists yum; then
        sudo yum update -y
        print_status "success" "Package list diperbarui (YUM)"
    elif command_exists pacman; then
        sudo pacman -Sy
        print_status "success" "Package list diperbarui (Pacman)"
    fi
    
    # Install essential tools for Linux
    print_status "loading" "Menginstall tools essential..."
    if command_exists apt-get; then
        sudo apt-get install -y curl wget git build-essential
    elif command_exists yum; then
        sudo yum install -y curl wget git gcc gcc-c++ make
    elif command_exists pacman; then
        sudo pacman -S curl wget git base-devel
    fi
    
    # Node.js installation
    if ! command_exists node || ! command_exists npm; then
        print_status "warning" "Node.js tidak ditemukan - Menginstall..."
        install_nodejs_linux
    else
        print_status "success" "Node.js sudah terinstall - $(node --version)"
    fi
    
    # Continue with standard installation
    continue_standard_installation
}

#============== TERMUX ANDROID INSTALLATION ==============
install_termux_android() {
    show_termux_banner
    display_duckhat_banner
    
    print_section_header "📱 INSTALASI TERMUX ANDROID" "$BOLD$ORANGE"
    
    print_status "info" "Memulai instalasi khusus untuk Termux Android..."
    echo
    
    # Check if running in Termux
    if [[ ! -d "/data/data/com.termux" ]] && [[ ! "$PREFIX" == *"termux"* ]]; then
        print_status "warning" "Sepertinya ini bukan environment Termux"
        echo -n "Lanjutkan instalasi Termux? (y/N): "
        read -r continue_termux
        if [[ ! "$continue_termux" =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi
    
    # Update Termux packages
    print_status "loading" "Memperbarui package Termux..."
    pkg update -y && pkg upgrade -y
    print_status "success" "Package Termux diperbarui"
    
    # Install essential packages for Termux
    print_status "loading" "Menginstall package essential untuk Termux..."
    pkg install -y curl wget git nodejs npm python clang make
    print_status "success" "Package essential terinstall"
    
    # Setup storage access
    print_status "loading" "Mengsetup akses storage..."
    if [[ ! -d "$HOME/storage" ]]; then
        termux-setup-storage
        print_status "success" "Storage access dikonfigurasi"
    else
        print_status "info" "Storage access sudah dikonfigurasi"
    fi
    
    # Create Termux-specific directories
    print_status "loading" "Membuat direktori khusus Termux..."
    mkdir -p "$HOME/.termux"
    mkdir -p "$HOME/DuckHat"
    cd "$HOME/DuckHat" || exit 1
    
    # Termux-specific Node.js check
    if command_exists node && command_exists npm; then
        print_status "success" "Node.js terinstall - $(node --version)"
    else
        print_status "error" "Node.js gagal terinstall di Termux"
        return 1
    fi
    
    # Continue with standard installation
    continue_standard_installation
}

#============== KALI LINUX INSTALLATION ==============
install_kali_linux() {
    show_kali_banner
    display_duckhat_banner
    
    print_section_header "🔒 INSTALASI KALI LINUX" "$BOLD$RED"
    
    print_status "info" "Memulai instalasi khusus untuk Kali Linux..."
    echo
    
    # Check if running on Kali
    if [[ ! -f "/etc/os-release" ]] || ! grep -q "kali" /etc/os-release; then
        print_status "warning" "Sepertinya ini bukan Kali Linux"
        echo -n "Lanjutkan dengan instalasi Kali? (y/N): "
        read -r continue_kali
        if [[ ! "$continue_kali" =~ ^[Yy]$ ]]; then
            return 1
        fi
    fi
    
    # Update Kali repositories
    print_status "loading" "Memperbarui repositories Kali Linux..."
    sudo apt-get update -qq
    print_status "success" "Repositories Kali diperbarui"
    
    # Install Kali-specific packages
    print_status "loading" "Menginstall package khusus Kali Linux..."
    sudo apt-get install -y curl wget git build-essential nodejs npm
    sudo apt-get install -y netcat-traditional nmap masscan metasploit-framework
    print_status "success" "Package Kali Linux terinstall"
    
    # Install additional security tools
    print_status "loading" "Menginstall security tools tambahan..."
    sudo apt-get install -y aircrack-ng wireshark hashcat john sqlmap
    print_status "success" "Security tools terinstall"
    
    # Setup Kali-specific configurations
    print_status "loading" "Konfigurasi khusus Kali Linux..."
    
    # Enable PostgreSQL for Metasploit
    sudo systemctl enable postgresql
    sudo systemctl start postgresql
    
    # Setup Metasploit database
    sudo msfdb init
    
    print_status "success" "Konfigurasi Kali Linux selesai"
    
    # Node.js version check for Kali
    if command_exists node && command_exists npm; then
        print_status "success" "Node.js terinstall - $(node --version)"
    else
        print_status "error" "Node.js gagal terinstall di Kali"
        return 1
    fi
    
    # Continue with standard installation
    continue_standard_installation
}

#============== AUTO DETECT INSTALLATION ==============
auto_detect_and_install() {
    show_autodetect_banner
    display_duckhat_banner
    
    print_section_header "🔍 AUTO DETECT PLATFORM" "$BOLD$PURPLE"
    
    print_status "loading" "Mendeteksi platform secara otomatis..."
    
    # Check for Termux
    if [[ -d "/data/data/com.termux" ]] || [[ "$PREFIX" == *"termux"* ]]; then
        print_status "success" "Terdeteksi: ${ORANGE}Termux Android${NC}"
        install_termux_android
        return
    fi
    
    # Check for Kali Linux
    if [[ -f "/etc/os-release" ]] && grep -q "kali" /etc/os-release; then
        print_status "success" "Terdeteksi: ${RED}Kali Linux${NC}"
        install_kali_linux
        return
    fi
    
    # Check for standard Linux
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        local distro=$(get_distro)
        print_status "success" "Terdeteksi: ${GREEN}Linux ($distro)${NC}"
        install_linux_desktop
        return
    fi
    
    # Check for macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "success" "Terdeteksi: ${BLUE}macOS${NC}"
        install_linux_desktop  # Use Linux installation for macOS
        return
    fi
    
    # Default fallback
    print_status "warning" "Platform tidak dapat dideteksi secara otomatis"
    print_status "info" "Menggunakan instalasi Linux standar..."
    install_linux_desktop
}

#============== ENHANCED NODE.JS INSTALLATION FOR LINUX ==============
install_nodejs_linux() {
    print_status "loading" "Menginstall Node.js untuk Linux..."
    
    if command_exists apt-get; then
        # Install NodeSource repository for latest Node.js
        curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif command_exists yum; then
        # Install NodeSource repository for RHEL/CentOS
        curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
        sudo yum install -y nodejs npm
    elif command_exists pacman; then
        sudo pacman -S nodejs npm
    else
        print_status "error" "Package manager tidak didukung untuk instalasi Node.js"
        return 1
    fi
    
    print_status "success" "Node.js berhasil diinstall"
}

#============== CONTINUE STANDARD INSTALLATION ==============
continue_standard_installation() {
sleep 2
clear
display_banner_logut
    echo
    print_status "info" "Melanjutkan dengan instalasi standar..."
    
    # Create project structure
    if ! create_project_structure; then
        handle_error
    fi

    # Install dependencies
    if ! install_dependencies; then
        handle_error
    fi

    # Verify installation
    if ! verify_installation; then
        handle_error
    fi

    # Show final instructions
    show_final_instructions

    # Interactive startup option
    echo
    echo -n -e "${BOLD}${GREEN}🚀 Start server now? ${WHITE}(y/N): ${NC}"
    read -r START_NOW
    echo
    
    if [[ "$START_NOW" =~ ^[Yy]$ ]]; then
        print_status "loading" "Starting server in 3 seconds..."
        for i in {3..1}; do
            echo -n -e "${CYAN}$i... ${NC}"
            sleep 1
        done
        echo
        print_status "success" "Launching DuckHat RAT Panel!"
        sleep 1
        
        if [[ -f "start.sh" ]]; then
            bash start.sh
        else
            print_status "error" "start.sh not found! Starting with node directly..."
            node index.js
        fi
    else
        echo
        print_status "info" "Ready to start! Run ${CYAN}bash start.sh${NC} when ready"
        print_colored $LIGHT_BLUE "💡 Tip: Use ${CYAN}npm run dev${NC} for development mode with auto-reload"
    fi
}

#============== MAIN INSTALLATION FUNCTION ==============
main() {
    # Display enhanced banner
    display_banner

    # Show installation menu
    show_installation_menu
}

# Execute main function
main "$@"
