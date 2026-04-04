import { ReactNode } from "react";
import { Container } from "./Container";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function PageContainer({
  children,
  title,
  description,
  size = "xl",
}: PageContainerProps) {
  return (
    <div className="py-8">
      <Container size={size}>
        {(title || description) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-4xl font-bold mb-3">
                {title.split(" ").map((word, i) =>
                  i === 0 ? (
                    <span key={i} className="text-gradient">
                      {word}{" "}
                    </span>
                  ) : (
                    <span key={i}>{word} </span>
                  )
                )}
              </h1>
            )}
            {description && (
              <p className="text-lg text-[#7d8590]">{description}</p>
            )}
          </div>
        )}
        {children}
      </Container>
    </div>
  );
}
