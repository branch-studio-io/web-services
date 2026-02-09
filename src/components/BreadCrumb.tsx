export type BreadCrumbPath = {
  name: string;
  href: string;
  current?: boolean;
};

type BreadCrumbProps = {
  paths: BreadCrumbPath[];
};

export default function BreadCrumb({ paths }: BreadCrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol role="list" className="flex items-center space-x-2">
        {paths.map((page, index) => {
          const isLast = index === paths.length - 1;
          return (
            <li key={page.name}>
              <div className="flex items-center">
                {index > 0 && (
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className="text-ink-500 size-5 shrink-0"
                  >
                    <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                  </svg>
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className={`${index > 0 ? "ml-2" : ""} text-ink-300 text-sm font-medium`}
                  >
                    {page.name}
                  </span>
                ) : (
                  <a
                    href={page.href}
                    className={`${index > 0 ? "ml-2" : ""} text-ink-500 text-sm font-medium hover:underline hover:underline-offset-2`}
                  >
                    {page.name}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
