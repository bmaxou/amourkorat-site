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
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;font-family:Inter,system-ui,sans-serif;color:#17242C;background:#D9E3E8}
.box{width:100%;max-width:460px;background:#F5F7F8;border:1px solid #17242C;border-radius:2px;padding:44px 36px;text-align:center}
h1{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:3rem;margin:0;line-height:1}
p{color:#4A5A63;margin:14px 0 28px;line-height:1.6}
input{width:100%;padding:14px 16px;border-radius:2px;border:1px solid #D3DCE1;background:#fff;color:#17242C;font:inherit;font-size:1rem;margin-bottom:14px}
input:focus{outline:2px solid #34525F}
.b{display:block;width:100%;padding:13px;border-radius:2px;border:1px solid #34525F;font-family:"Instrument Serif",Georgia,serif;font-size:1.45rem;cursor:pointer;margin-top:10px;line-height:1.1}
.new{background:#34525F;color:#fff}.new:hover{background:#17242C}
.old{background:transparent;color:#34525F}.old:hover{background:#E9EEF1}
.b small{display:block;font-family:Inter,sans-serif;font-size:.78rem;opacity:.75;margin-top:3px}
.err{color:#9B3B2E;margin-bottom:12px}
</style>
</head>
<body>
<form class="box" method="post">
<h1>Amour Korat</h1>
<p>Le site est en préparation.<?php if (!$ok): ?> Saisissez le mot de passe, puis choisissez le site à ouvrir.<?php endif; ?></p>
<?php if ($msg): ?><div class="err"><?php echo htmlspecialchars($msg); ?></div><?php endif; ?>
<?php if (!$ok): ?><input type="password" name="pwd" placeholder="Mot de passe" autofocus aria-label="Mot de passe"><?php endif; ?>
<button class="b new" type="submit" name="go" value="/nouveau/">Nouveau site<small>La version en construction</small></button>
<button class="b old" type="submit" name="go" value="<?php echo htmlspecialchars($old_target); ?>">Ancien site<small>Les archives Amour Korat</small></button>
</form>
</body>
</html>
