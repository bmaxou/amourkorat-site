<?php
$hash = '$2y$12$D0DHPo27TpwkYzHtesj4a.EARPRv8gvxvXtbML/Tfu9s/Hj2DnoWG';
$msg = '';
$ok = isset($_COOKIE['korat_ok']) && $_COOKIE['korat_ok'] === '1';
$current = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/';
if ($current === '/' || $current === '/gate.php' || strpos($current, '/nouveau') === 0) { $old_target = '/index.html'; } else { $old_target = $current; }
$success_redirect = null;
function safe_target($t) { return (is_string($t) && strlen($t) > 0 && $t[0] === '/' && (strlen($t) < 2 || $t[1] !== '/')) ? $t : '/'; }
if (isset($_POST['go'])) {
    $target = safe_target($_POST['go']);
    if ($ok) {
        $success_redirect = $target;
    } elseif (isset($_POST['pwd']) && password_verify($_POST['pwd'], $hash)) {
        setcookie('korat_ok', '1', time() + 60*60*24*30, '/');
        $success_redirect = $target;
    } else {
        $msg = 'Mot de passe incorrect.';
    }
}
if ($success_redirect !== null) {
?><!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="robots" content="noindex,nofollow"><title>Amour Korat</title></head><body>
<script>try{localStorage.setItem('korat_ok','1')}catch(e){}location.replace(<?php echo json_encode($success_redirect); ?>);</script></body></html><?php
exit;
}
?><!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Amour Korat · Site en préparation</title>
<meta name="robots" content="noindex,nofollow">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,500&family=Manrope:wght@400;600&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:Manrope,system-ui,sans-serif;color:#E6ECEE;background:#0E1417 radial-gradient(900px 500px at 20% 10%,#1E3A2E 0%,transparent 60%)}
.box{width:100%;max-width:440px;background:rgba(23,32,37,.85);border:1px solid #2A373D;border-radius:22px;padding:40px 34px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.45)}
svg{width:54px;height:54px;margin-bottom:10px}
h1{font-family:"Cormorant Garamond",Georgia,serif;font-weight:600;font-size:2.3rem;margin:0}
h1 em{color:#B9D27E;font-weight:500}
p{color:#A8B6BC;margin:10px 0 26px;line-height:1.6}
input{width:100%;padding:14px 16px;border-radius:12px;border:1px solid #2A373D;background:#101619;color:#E6ECEE;font:inherit;font-size:1rem;margin-bottom:14px}
input:focus{outline:2px solid #7FC4A4}
.b{display:block;width:100%;padding:14px;border-radius:999px;border:1px solid transparent;font:inherit;font-weight:600;font-size:1rem;cursor:pointer;margin-top:10px}
.new{background:#E8F1E4;color:#14241C}.new:hover{background:#fff}
.old{background:transparent;color:#E6ECEE;border-color:#4B5A61}.old:hover{border-color:#A8B6BC}
.b small{display:block;font-weight:400;font-size:.78rem;opacity:.7}
.err{color:#E59384;margin-bottom:12px}
</style>
</head>
<body>
<form class="box" method="post">
<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 43C15 36 6 29 6 19.5 6 13 10.6 8 16.6 8c3.2 0 5.6 1.5 7.4 4 1.8-2.5 4.2-4 7.4-4C37.4 8 42 13 42 19.5 42 29 33 36 24 43z" fill="#8FA3AD"/><ellipse cx="18" cy="21" rx="3" ry="3.4" fill="#9DBB5E"/><ellipse cx="30" cy="21" rx="3" ry="3.4" fill="#9DBB5E"/><ellipse cx="18" cy="21" rx="1" ry="2.6" fill="#1D272C"/><ellipse cx="30" cy="21" rx="1" ry="2.6" fill="#1D272C"/></svg>
<h1>Amour <em>Korat</em></h1>
<p>Le site est en préparation.<?php if (!$ok): ?> Saisissez le mot de passe, puis choisissez le site à ouvrir.<?php endif; ?></p>
<?php if ($msg): ?><div class="err"><?php echo htmlspecialchars($msg); ?></div><?php endif; ?>
<?php if (!$ok): ?><input type="password" name="pwd" placeholder="Mot de passe" autofocus aria-label="Mot de passe"><?php endif; ?>
<button class="b new" type="submit" name="go" value="/nouveau/">Nouveau site<small>La version en construction</small></button>
<button class="b old" type="submit" name="go" value="<?php echo htmlspecialchars($old_target); ?>">Ancien site<small>Les archives Amour Korat</small></button>
</form>
</body>
</html>
