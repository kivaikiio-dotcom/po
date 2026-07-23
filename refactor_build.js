const fs = require('fs');
const path = require('path');

let content = fs.readFileSync('build.js', 'utf8');

// 1. Replace counties with countries
const countiesRegex = /const counties = \[[\s\S]*?\];/;
const countriesCode = `const countries = [
    'Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'South Sudan',
    'Ethiopia', 'Somaliland', 'Eritrea', 'Angola', 'Botswana', 'Comoros',
    'Democratic Republic of Congo', 'Eswatini', 'Lesotho', 'Madagascar',
    'Malawi', 'Mauritius', 'Mozambique', 'Namibia', 'Seychelles',
    'South Africa', 'Zambia', 'Zimbabwe'
];`;
content = content.replace(countiesRegex, countriesCode);

// 2. Expand Research Capabilities
const researchCapRegex = /(id: 'research-capacity'[\s\S]*?capabilities: \[)([\s\S]*?)(\],)/;
const newResearchCap = `$1
            { id: 'parameter-identification', name: 'Development Parameter Definition', desc: 'Solidifying baseline indicators to guide long-term strategic plans and regional integration across East Africa and SADCC.' },
            { id: 'data-analytics-modeling', name: 'Analytical Modeling & Dashboards', desc: 'Deploying custom dashboards and business intelligence tools for real-time visualization of policy outcomes.' },
            { id: 'macroeconomic-forecasting', name: 'Macro-Economic Forecasting', desc: 'Modeling market trends, inflation risks, and financial indicators to guide strategy across African economies.' },
            { id: 'competitive-intelligence', name: 'Competitive Intelligence', desc: 'Investigating industry shifts, organizational benchmarks, and growth drivers in emerging markets.' },
            { id: 'policy-briefs', name: 'Policy Briefs & Whitepapers', desc: 'Drafting authoritative policy briefs and whitepapers to influence legislative agendas and public discourse.' },
            { id: 'market-entry-feasibility', name: 'Market Entry & Feasibility', desc: 'Providing rigorous feasibility studies for international organizations entering regional markets.' },
            { id: 'demographic-polling', name: 'Demographic Polling & Surveys', desc: 'Executing large-scale demographic surveys to capture real-time citizen sentiment.' }
$3`;
content = content.replace(researchCapRegex, newResearchCap);

// 3. Update Courses Pricing (-50%) and expand desc
content = content.replace(/price: '\$([0-9,]+)'/g, (match, p1) => {
    let price = parseInt(p1.replace(',', ''));
    let newPrice = Math.floor(price / 2);
    return `price: '$${newPrice}'`;
});

// 4. Remove WhatsApp from Footer
const whatsappRegex = /<!-- WhatsApp Floating Button -->[\s\S]*?<\/div>(\s*<!-- Back to Top -->)/;
content = content.replace(whatsappRegex, '$1');

// 5. Update Navbar in getHeader to include Country Dropdown
const navbarRegex = /(<ul class="nav-links" id="navLinks">)/;
const navReplaceHtml = `<div class="country-selector" style="margin-right: 1rem; margin-top: 0.5rem; display: flex; align-items: center;">
                <select onchange="if(this.value) window.location.href=this.value;" aria-label="Select Country" style="padding: 0.35rem 0.75rem; border-radius: 4px; border: 1px solid var(--glass-border); background: var(--glass-bg); color: var(--text-primary); cursor: pointer; font-family: inherit; font-size: 0.9rem; font-weight: 500; appearance: none; outline: none; transition: border-color 0.3s ease;">
                    \${countries.map(c => {
                        const cSlug = c.toLowerCase().replace(/[^a-z0-9]/g, '-');
                        const isCurrent = (currentCountry === c);
                        return \`<option value="\${prefix}../\${cSlug}/index.html" \${isCurrent ? 'selected' : ''} style="background: var(--bg-secondary); color: var(--text-primary);">\${c}</option>\`;
                    }).join('')}
                </select>
                <div style="position: relative; right: 20px; pointer-events: none; color: var(--accent-gold);">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
            </div>
            $1`;
content = content.replace(navbarRegex, navReplaceHtml);

const headerSigRegex = /const getHeader = \(title, description, canonicalUrl, depth, breadcrumbs = \[\]\) => \{/;
const newHeaderSig = `const getHeader = (title, description, canonicalUrl, depth, breadcrumbs = [], currentCountry = 'Kenya') => {`;
content = content.replace(headerSigRegex, newHeaderSig);

// 6. Rewrite the build system loop and functions to accept country
const buildFuncs = ['buildCorePages', 'buildMainServicePages', 'buildSubCapabilityPages', 'buildSectorPages', 'buildCoursePages', 'buildCertificationPages', 'buildGlossaryPages', 'buildCaseStudyPages', 'buildInsightPages', 'buildHtmlSitemap'];

buildFuncs.forEach(fn => {
    content = content.replace(new RegExp(`const ${fn} = \\(\\) => \\{`), `const ${fn} = (country, countrySlug) => {`);
});

// Disable county pages
content = content.replace(/const buildCountyPages = \(\) => \{[\s\S]*?\};/, 'const buildCountyPages = (country, countrySlug) => { /* Disabled, site is duplicated instead */ };');

// Add Corporate Discount Formula to courses
const courseHtmlRegex = /(<h2 style="color:var\(--text-title\); margin-bottom:1rem;">Program Curriculum Summary<\/h2>)/;
const corporateDiscountHtml = `
                    <div class="corporate-discount" style="margin-bottom: 2rem; padding: 1.5rem; background: rgba(243,112,33,0.1); border-left: 4px solid var(--accent-gold); border-radius: 4px;">
                        <h3 style="color: var(--accent-gold); margin-bottom: 0.75rem;">Corporate Tier Pricing</h3>
                        <p style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--text-primary);">Enroll multiple employees to unlock significant team discounts:</p>
                        <ul style="font-size: 0.95rem; margin-left: 1.5rem; color: var(--text-primary); margin-top: 0.5rem; line-height: 1.6;">
                            <li><strong>5 - 10 Participants:</strong> 10% Discount</li>
                            <li><strong>11 - 20 Participants:</strong> 15% Discount</li>
                            <li><strong>21+ Participants:</strong> 25% Discount</li>
                        </ul>
                    </div>
                    $1`;
content = content.replace(courseHtmlRegex, corporateDiscountHtml);

// 7. Update writes to use countrySlug directory
// For writeHtmlFile('index.html' -> writeHtmlFile(`${countrySlug}/index.html`
content = content.replace(/writeHtmlFile\('([^']+)'/g, "writeHtmlFile(`${countrySlug}/$1`");
content = content.replace(/writeHtmlFile\(\`([^`]+)\`/g, "writeHtmlFile(`${countrySlug}/$1`");
// Ensure it doesn't double replace later if we run script multiple times (we won't)

// Add country parameter to all getHeader calls
content = content.replace(/getHeader\(([^,]+), ([^,]+), ([^,]+), (\d+)/g, (match, p1, p2, p3, p4) => {
    return `getHeader(${p1}, ${p2}, ${p3}, parseInt(${p4}) + 1`; // Increase depth by 1 since we're in /kenya/
});
content = content.replace(/\]\)/g, '], country)'); // pass country to getHeader

// Update canonical URLs in functions to include countrySlug
content = content.replace(/const canonical = \`https:\/\/www\.policy\.co\.ke\//g, 'const canonical = `https://www.policy.co.ke/${countrySlug}/');

// Build tracking: allGeneratedUrls needs to include countrySlug so sitemap is correct
content = content.replace(/allGeneratedUrls\.push\('([^']+)'/g, "allGeneratedUrls.push(`${countrySlug}/$1`");
content = content.replace(/allGeneratedUrls\.push\(\`([^`]+)\`/g, "allGeneratedUrls.push(`${countrySlug}/$1`");

// 8. Rewrite runBuild
const runBuildRegex = /const runBuild = \(\) => \{[\s\S]*?\};/;
const newRunBuild = `const runBuild = () => {
    console.log('=== STARTING POLICY ORACLE REGIONAL BUILD ===');
    
    // Generate root index redirect
    const rootRedirect = \`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=kenya/index.html">
    <title>Redirecting...</title>
</head>
<body>
    Redirecting to <a href="kenya/index.html">Kenya site</a>.
</body>
</html>\`;
    writeHtmlFile('index.html', rootRedirect);

    countries.forEach(country => {
        const countrySlug = country.toLowerCase().replace(/[^a-z0-9]/g, '-');
        console.log(\`Building site for \${country}...\`);
        buildCorePages(country, countrySlug);
        buildMainServicePages(country, countrySlug);
        buildSubCapabilityPages(country, countrySlug);
        buildSectorPages(country, countrySlug);
        buildCoursePages(country, countrySlug);
        buildCertificationPages(country, countrySlug);
        buildGlossaryPages(country, countrySlug);
        buildCaseStudyPages(country, countrySlug);
        buildInsightPages(country, countrySlug);
        buildHtmlSitemap(country, countrySlug);
    });

    buildSitemapXml();
    buildRobotsTxt();
    console.log('=== BUILD COMPLETED SUCCESSFULLY ===');
    console.log(\`Total indexable static pages created: \${allGeneratedUrls.length}\`);
};`;
content = content.replace(runBuildRegex, newRunBuild);

// Clean up sitemap locations loop
content = content.replace(/Choose a county location to view tailored services:/, 'Choose a regional location to view tailored services:');
content = content.replace(/locations\/\$\{slug\}\/monitoring-evaluation\.html/, '${slug}/consulting.html');
content = content.replace(/\$\{c\} County M&amp;E/, '${c} Consulting');

fs.writeFileSync('build.js', content, 'utf8');
console.log('build.js updated successfully!');
