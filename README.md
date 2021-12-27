## Template tag and Higher order function

```js
const StyledDiv = styled.div`
  position: relative;
  padding: 10px;
`;

const StyledApp = styled(App)`
  position: relative;
  padding: 10px;
`;
```

- `styled.div` or `styled(App)` is tag function.

Tag functions:

```js
const myMessage = message`
  Hello ${name},
  Very Good ${time}
`;
```

```js
function message(strings, ...expression) {
  // string will be array of static part ["Hello ", ",\nVery Good ", "\n"];
  // expressions will be dynamic interpolations [name, time]
}
```

So for styled component it will be

```js
const StyledApp = styled(App)`
  position: relative;
  padding: 10px;
  color: ${props => props.color};
`

const func = styled(App) // or styled.div
function (styleStrings, ..interpolation) {
  //...
}
```

- styled(App) or styled.div is an HOC with forward ref
- styled.div is shorthand of styled(div)

```js
function styled(Component) {
  return (styleStrings, ...interpolations) => {
    return forwardRef((props, ref) => {
      //...
      return <Component ref={ref} {...props} />;
    });
  };
}

const domElements = ["div", "a", "button" /* ... */];

domElements.forEach((elm) => {
  styled[elm] = styled(elm);
});
```

## Classname generation and style processing.

### Two classNames:

**1st: styled component id**

- styled component generates styled componentId using component displayName and file names when babel is used.
- component id -> displayName - hash of (styled component version + name + counter)
- This is used to uniquely identify a styled component on nested styles, server rendering, also for the dynamic classname generation.

**2nd: dynamic classname**

- styled component generates a new className hash using (componentId, generatedStyleStr (after applying interpolation))

```js
const StyledApp = styled(App)`
  position: relative;
  color: ${(props) => props.color};
  padding: ${DEFAULT_PADDING};
`;


<StyledApp color="red" ref={myComponentRef}>
```

Styled component will have static styled and interpolation

Static Style strings: ['position: relative;\ncolor: ', '\npadding: ', '\n'];
Interpolation : [(props) => props.color, DEFAULT_PADDING];

```js
function styled(Component) {
  return (styleStrings, ...interpolations) => {
    return forwardRef((props, ref) => {
      //...
      const evaluatedInterpolation = interpolations.map((expr) => {
        if (typeof expr === "function") return expr(props);
        return expr;
      });

      // combine string and interpolation
      const generatedStyleStr = combineStaticAndDynamic(
        styleStrings,
        evaluatedInterpolation
      );

      // create className
      const className = hash(componentId, generatedStyleStr);

      // ...

      return (
        <Component
          ref={ref}
          {...props}
          css=""
          className={`${componentId} ${className} ${props.className}`}
        />
      );
    });
  };
}
```

### Style Processing:

- styled component uses stylis lib to pre process styles.

```js
const StyledApp = styled(App)`
  position: relative;
  color: ${(props) => props.color};

  && .some-element {
    color: red;
  }
`;
```

- & will be replaced with generated className `.${className}`,

- They also mark component if there is no interpolation, to avoid heavy computations.

### How props and theme work with styled components?

## props

- Props are passed to interpolations
- Props can be filtered through shouldForwardProp,
- You can also make a prop transient prop by prefixing with `$`
- Props merges attributes provided with .attr() util

```js
function styled(Component) {
  return (styleStrings, ...interpolations) => {
    return forwardRef((props, ref) => {
      con;
      const theme = useContext(ThemeProvider);
      const updatedProps = {
        theme,
        ...props,
      };
      // ...
    });
  };
}
```

## Theme support

- uses context, and enhance props with theme

```js
function styled(Component) {
  return (styleStrings, ...interpolations) => {
    return forwardRef((props, ref) => {
      const theme = useContext(ThemeProvider);
      const updatedProps = {
        theme,
        ...props,
      };
      // ...
    });
  };
}

const StyledApp = styled(Component).witConfig({shouldForwardProp: (prop) => });
```

### How nesting works in styled component

- & will be replaced with generated className `.${className}`,
- For nested element context of & will change.
- Due to & replacement reverse selector is supported.

```js
const StyledApp = styled(App)`
  position: relative;
  color: ${(props) => props.color};

  .some-element {
    color: red;
  }
`;
```

<StyledComponent><div className="element"></div></StyledComponent>

- For Nesting Styled Component componentId's are used. Note the nested component must be Styled component

```js
const StyledApp = styled(App)`
  position: relative;
  color: ${(props) => props.color};

  ${Children} {
    color: red;
  }
`;
```

### How createGlobalStyle works

- Show demo
- Support interpolation

```js
function createGlobalStyle(strings, ...interpolations) {
  return (props) => {
    // generate styles through app
    const evaluatedInterpolation = interpolations.map((expr) => {
      if (typeof expr === "function") return expr(props);
      return expr;
    });

    // combine string and interpolation
    const generatedStyleStr = combineStaticAndDynamic(
      styleStrings,
      evaluatedInterpolation
    );

    const styles = stylis(generatedStyleStr);

    useEffect(() => {
      // append to styles rules to style tag
    }, style);
    return null;
  };
}
```

### Style component attributes

### Server-side rendering

- Generates component id during compilation using babel plugin
- Use Context to push generated styles to a collectStyles.
