type DefaultChildrenProps = {
  children?: any;
}

export function DefaultChildren(props: DefaultChildrenProps) {
  return <div>
    <h1>Welcome!</h1>
    <main>
      {props.children}
    </main>
    <footer>
      Thanks for visiting.
    </footer>
  </div>
}
