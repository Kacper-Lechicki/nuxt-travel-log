<template>
  <header class="sticky top-0 left-0 navbar dark:bg-primary/75 text-primary-content z-[1000]">
    <div class="navbar-start">
      <NuxtLink class="flex items-center gap-3 btn btn-ghost text-xl" to="/">
        <Icon name="tabler:map" size="21" />
        <h1>Travel Log</h1>
      </NuxtLink>
    </div>

    <div class="flex items-center md:gap-2 navbar-end">
      <UiThemeToggle />
      <AuthButton />
    </div>
  </header>
</template>
