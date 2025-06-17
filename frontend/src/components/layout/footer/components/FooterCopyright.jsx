import React from "react";

const FooterCopyright = () => (
  <div className="mt-10 border-t border-foreground/10 dark:border-border pt-5 text-sm text-center">
    <p>© {new Date().getFullYear()} Brick Draft. All rights reserved</p>
  </div>
);

export default FooterCopyright;