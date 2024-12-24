import os
import json
import re
from pathlib import Path
from typing import List, Dict, Set

class TailwindChecker:
    def __init__(self, project_path: str):
        self.project_path = Path(project_path)
        self.tailwind_references: Dict[str, List[str]] = {}
        
    def check_config_files(self) -> List[str]:
        """Check for Tailwind configuration files."""
        config_files = []
        tailwind_configs = [
            'tailwind.config.js',
            'tailwind.config.cjs',
            'postcss.config.js',
            'postcss.config.cjs'
        ]
        
        for config in tailwind_configs:
            if (self.project_path / config).exists():
                config_files.append(str(self.project_path / config))
                
        return config_files
    
    def check_package_json(self) -> Dict[str, List[str]]:
        """Check package.json for Tailwind dependencies."""
        tailwind_deps = []
        package_json = self.project_path / 'package.json'
        
        if package_json.exists():
            with open(package_json, 'r', encoding='utf-8') as f:
                try:
                    data = json.load(f)
                    # Check both dependencies and devDependencies
                    for dep_type in ['dependencies', 'devDependencies']:
                        if dep_type in data:
                            for dep in data[dep_type]:
                                if any(tw in dep.lower() for tw in ['tailwind', 'postcss']):
                                    tailwind_deps.append(f"{dep}: {data[dep_type][dep]}")
                except json.JSONDecodeError:
                    return {"error": ["Invalid package.json format"]}
                
        return {"package.json": tailwind_deps} if tailwind_deps else {}

    def check_html_files(self) -> Dict[str, List[str]]:
        """Check HTML files for Tailwind classes."""
        tailwind_classes = set()
        results = {}
        
        # Common Tailwind class patterns
        patterns = [
            r'class="[^"]*(?:text-|bg-|p-|m-|flex|grid|border-|rounded|shadow)[^"]*"',
            r'className="[^"]*(?:text-|bg-|p-|m-|flex|grid|border-|rounded|shadow)[^"]*"'
        ]
        
        for html_file in self.project_path.rglob('*.html'):
            with open(html_file, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = []
                for pattern in patterns:
                    matches.extend(re.findall(pattern, content))
                if matches:
                    rel_path = str(html_file.relative_to(self.project_path))
                    results[rel_path] = matches
                    
        return results

    def check_css_files(self) -> Dict[str, List[str]]:
        """Check CSS files for Tailwind imports and directives."""
        results = {}
        
        for css_file in self.project_path.rglob('*.css'):
            with open(css_file, 'r', encoding='utf-8') as f:
                content = f.read()
                tailwind_directives = re.findall(r'@tailwind[^;]*;', content)
                if tailwind_directives:
                    rel_path = str(css_file.relative_to(self.project_path))
                    results[rel_path] = tailwind_directives
                    
        return results

    def run_check(self) -> Dict[str, Dict]:
        """Run all checks and return results."""
        return {
            "config_files": {"found": self.check_config_files()},
            "package_dependencies": self.check_package_json(),
            "html_files": self.check_html_files(),
            "css_files": self.check_css_files()
        }

    def print_report(self, results: Dict[str, Dict]) -> None:
        """Print a formatted report of the findings."""
        print("\n=== Tailwind Usage Report ===\n")
        
        # Config Files
        print("Configuration Files Found:")
        if results["config_files"]["found"]:
            for file in results["config_files"]["found"]:
                print(f"  - {file}")
        else:
            print("  None found")
            
        # Package Dependencies
        print("\nPackage Dependencies:")
        if results["package_dependencies"]:
            for file, deps in results["package_dependencies"].items():
                print(f"\n  In {file}:")
                for dep in deps:
                    print(f"    - {dep}")
        else:
            print("  No Tailwind-related dependencies found")
            
        # HTML Files
        print("\nHTML Files with Tailwind Classes:")
        if results["html_files"]:
            for file, classes in results["html_files"].items():
                print(f"\n  {file}:")
                for class_str in classes[:5]:  # Limit to 5 examples per file
                    print(f"    - {class_str[:100]}...")
                if len(classes) > 5:
                    print(f"    ... and {len(classes) - 5} more instances")
        else:
            print("  No Tailwind classes found in HTML files")
            
        # CSS Files
        print("\nCSS Files with Tailwind Directives:")
        if results["css_files"]:
            for file, directives in results["css_files"].items():
                print(f"\n  {file}:")
                for directive in directives:
                    print(f"    - {directive}")
        else:
            print("  No Tailwind directives found in CSS files")

def main():
    # Get the current working directory
    project_path = os.getcwd()
    
    # Create checker instance
    checker = TailwindChecker(project_path)
    
    # Run checks
    results = checker.run_check()
    
    # Print report
    checker.print_report(results)

if __name__ == "__main__":
    main()